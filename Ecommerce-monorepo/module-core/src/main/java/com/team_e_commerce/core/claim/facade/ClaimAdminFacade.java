package com.team_e_commerce.core.claim.facade;

import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import com.team_e_commerce.core.claim.client.PaymentInternalClient;
import com.team_e_commerce.core.claim.entity.Claim;
import com.team_e_commerce.core.claim.service.ClaimAdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClaimAdminFacade {

    private final RedissonClient redissonClient;
    private final ClaimAdminService claimAdminService;
    private final PaymentInternalClient paymentInternalClient;

    // 1. 처리 시작 (락 적용)
    public void startProcessingClaim(Long adminId, Long claimId) {
        RLock lock = redissonClient.getLock("claim:lock:" + claimId);
        try {
            if (!lock.tryLock(3, 10, TimeUnit.SECONDS)) {
                throw new BusinessException(ErrorCode.TOO_MANY_REQUESTS);
            }
            claimAdminService.startProcessingClaim(adminId, claimId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    // 2. 환불 승인 (락 + 외부 API 통신 분리 + 보상 마킹)
    public void approveClaim(Long adminId, Long claimId) {
        RLock lock = redissonClient.getLock("claim:lock:" + claimId);

        try {
            if (!lock.tryLock(3, 10, TimeUnit.SECONDS)) {
                throw new BusinessException(ErrorCode.TOO_MANY_REQUESTS);
            }

            // ① 외부 통신 전 상태 검증 (트랜잭션 없이 단순 조회)
            Claim claim = claimAdminService.getClaimForValidation(claimId);
            if (claim.getClaimStatus() != Claim.ClaimStatus.PROCESSING && claim.getClaimStatus() != Claim.ClaimStatus.REQUESTED) {
                throw new BusinessException(ErrorCode.INVALID_CLAIM_STATUS);
            }

            // ② 외부 API 통신 (DB 커넥션 미점유)
            paymentInternalClient.cancelPayment(claim.getOrderLineItemId(), claim.getClaimAmount());

            // ③ API 성공 후 DB 상태 변경 및 Outbox(이력) 저장
            try {
                claimAdminService.completeClaimAndSaveHistory(adminId, claimId);
            } catch (Exception e) {
                // ④ DB 커밋 실패 시 독립 트랜잭션으로 수동 확인 상태 마킹
                claimAdminService.markAsManualCheckRequired(claimId);
                log.error("[CRITICAL] 클레임 승인(PG환불) 후 DB 커밋 실패. 수동 확인 필요 - claimId: {}", claimId, e);
                throw new BusinessException(ErrorCode.MANUAL_CHECK_REQUIRED);
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    // 3. 환불 거절 (락 적용)
    public void rejectClaim(Long adminId, Long claimId, String rejectReason) {
        RLock lock = redissonClient.getLock("claim:lock:" + claimId);
        try {
            if (!lock.tryLock(3, 10, TimeUnit.SECONDS)) {
                throw new BusinessException(ErrorCode.TOO_MANY_REQUESTS);
            }
            claimAdminService.rejectClaimAndSaveHistory(adminId, claimId, rejectReason);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}