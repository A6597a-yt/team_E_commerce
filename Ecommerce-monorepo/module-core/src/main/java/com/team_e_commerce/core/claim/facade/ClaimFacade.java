package com.team_e_commerce.core.claim.facade;

import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import com.team_e_commerce.core.claim.client.OrderInternalClient;
import com.team_e_commerce.common.dto.OrderLineItemInternalDto;
import com.team_e_commerce.core.claim.dto.ClaimCreateRequest;
import com.team_e_commerce.core.claim.dto.ClaimResponse;
import com.team_e_commerce.core.claim.service.ClaimService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClaimFacade {

    private final ClaimService claimService;
    private final OrderInternalClient orderInternalClient;
    private final RedissonClient redissonClient; // 💡 분산 락을 위한 의존성 추가

    // 고객 직접 클레임 생성 퍼사드 (회원 단위 분산 락 적용)
    public List<ClaimResponse> createClaims(Long memberId, ClaimCreateRequest request) {
        // 1. 회원 단위로 락 키 생성 (동일 회원의 동시 다발적 요청 차단)
        RLock lock = redissonClient.getLock("claim:lock:member:" + memberId);

        try {
            // 2. 락 획득 시도 (따닥 방지)
            if (!lock.tryLock(3, 10, TimeUnit.SECONDS)) {
                log.warn("클레임 생성 중복 요청 감지 - memberId: {}", memberId);
                throw new BusinessException(ErrorCode.TOO_MANY_REQUESTS);
            }

            List<Long> requestedItemIds = request.claimItems().stream()
                    .map(ClaimCreateRequest.ClaimItem::orderLineItemId)
                    .toList();

            // 3. 주문 모듈에서 데이터 단 한 번의 요청으로 가져오기 (Cross-Module Query)
            Map<Long, OrderLineItemInternalDto> orderItemMap = orderInternalClient.getOrderItems(requestedItemIds)
                    .stream()
                    .collect(Collectors.toMap(
                            OrderLineItemInternalDto::orderLineItemId,
                            item -> item,
                            (existing, replacement) -> existing // 💡 중복 키(Key) 방어 로직 추가: 500 에러 방지
                    ));

            // 4. 서비스로 위임 (순수 도메인 로직 및 트랜잭션)
            return claimService.createClaimsLocalTx(memberId, request, orderItemMap);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    // 시스템 자동 부분 취소 퍼사드 (락 없이 기존 로직 100% 유지)
    public void autoCancelClaimItems(Long memberId, List<Long> orderLineItemIds, String reason) {
        // 1. 주문 모듈에서 데이터 일괄 조회
        List<OrderLineItemInternalDto> items = orderInternalClient.getOrderItems(orderLineItemIds);

        if (items.isEmpty() || items.size() != orderLineItemIds.size()) {
            throw new BusinessException(ErrorCode.ORDER_ITEM_NOT_FOUND);
        }

        // 2. 서비스로 위임 (DB 저장 및 이벤트 발행)
        claimService.processAutoCancelLocalTx(memberId, items, reason);
    }
}