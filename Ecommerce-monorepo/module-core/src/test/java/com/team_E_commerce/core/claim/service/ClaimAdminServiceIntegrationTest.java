package com.team_E_commerce.core.claim.service;

import com.team_E_commerce.common.exception.BusinessException;
import com.team_E_commerce.common.exception.ErrorCode;
import com.team_E_commerce.core.TestCoreConfig;
import com.team_E_commerce.core.claim.client.OrderInternalClient;
import com.team_E_commerce.core.claim.client.dto.OrderLineItemInternalDto;
import com.team_E_commerce.core.claim.domain.Claim;
import com.team_E_commerce.core.claim.dto.ClaimCreateRequest;
import com.team_E_commerce.core.claim.dto.ClaimResponse;
import com.team_E_commerce.core.claim.dto.ClaimSearchCondition;
import com.team_E_commerce.core.claim.event.ClaimWithdrawnEvent;
import com.team_E_commerce.core.claim.repository.ClaimRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.event.ApplicationEvents;
import org.springframework.test.context.event.RecordApplicationEvents;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.BDDMockito.given;

@SpringBootTest(classes = TestCoreConfig.class)
@RecordApplicationEvents
class ClaimServiceIntegrationTest {

    @Autowired
    private ClaimService claimService;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private ApplicationEvents applicationEvents; // 수집된 이벤트를 검증하기 위한 빈

    @MockitoBean
    private OrderInternalClient orderInternalClient;

    private final Long MEMBER_ID = 1L;
    private final String ORDER_NUMBER = "20260314-ORD-001";

    @AfterEach
    void tearDown() {
        // 독립된 트랜잭션이 끝난 후 데이터를 직접 비워줍니다.
        claimRepository.deleteAll();
    }

    // 클레임 접수 테스트
    @Test
    @DisplayName("클레임 다건 접수 성공 - 배치 인서트로 정상 저장된다")
    void createClaims_Success() {
        // given: 주문 서버에서 2개의 상품 정보를 정상적으로 반환한다고 Mocking
        List<OrderLineItemInternalDto> mockOrderItems = List.of(
                new OrderLineItemInternalDto(100L, MEMBER_ID, "상품 A", 10000L, 2L, "DELIVERED", ORDER_NUMBER),
                new OrderLineItemInternalDto(101L, MEMBER_ID, "상품 B", 20000L, 1L, "DELIVERED", ORDER_NUMBER)
        );
        given(orderInternalClient.getOrderItems(anyList())).willReturn(mockOrderItems);

        ClaimCreateRequest request = new ClaimCreateRequest(
                List.of(
                        new ClaimCreateRequest.ClaimItem(100L, 1),
                        new ClaimCreateRequest.ClaimItem(101L, 1)
                ),
                "RETURN", "단순 변심", null, null
        );

        // when
        List<ClaimResponse> responses = claimService.createClaims(MEMBER_ID, request);

        // then: 2건이 정상적으로 응답 객체로 반환되고, DB에도 정확히 2건이 저장되었는지 확인
        assertThat(responses).hasSize(2);

        List<Claim> savedInDb = claimRepository.findAll();
        assertThat(savedInDb).hasSize(2)
                .extracting("orderLineItemId")
                .containsExactlyInAnyOrder(100L, 101L);
    }

    @Test
    @DisplayName("클레임 접수 실패 - 이미 접수된 상품 ID가 포함되어 있으면 예외가 발생한다")
    void createClaims_Fail_AlreadyClaimed() {
        // given: 이미 100번 상품에 대해 클레임이 진행 중인 상태로 DB 세팅
        Claim existingClaim = Claim.builder()
                .orderLineItemId(100L).memberId(MEMBER_ID).productName("상품 A")
                .claimType(Claim.ClaimType.RETURN).reason("파손").claimAmount(10000L)
                .claimQuantity(1L).orderNumber(ORDER_NUMBER).build();
        claimRepository.save(existingClaim);

        given(orderInternalClient.getOrderItems(anyList())).willReturn(List.of(
                new OrderLineItemInternalDto(100L, MEMBER_ID, "상품 A", 10000L, 2L, "DELIVERED", ORDER_NUMBER)
        ));

        ClaimCreateRequest request = new ClaimCreateRequest(
                List.of(new ClaimCreateRequest.ClaimItem(100L, 1)), // 이미 접수된 100번으로 재요청
                "RETURN", "재요청", null, null
        );

        // when & then
        assertThatThrownBy(() -> claimService.createClaims(MEMBER_ID, request))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.ALREADY_CLAIMED);
    }

    // 클레임 조회 테스트

    @Test
    @DisplayName("클레임 조회 성공 - QueryDSL 조건에 맞춰 필터링된 Page 객체가 반환된다")
    void getClaimHistory_Success() {
        // given: 서로 다른 상태의 클레임 2건 저장
        claimRepository.save(Claim.builder()
                .orderLineItemId(200L).memberId(MEMBER_ID).productName("상품 C")
                .claimType(Claim.ClaimType.RETURN).reason("이유1").claimAmount(10000L).claimQuantity(1L).orderNumber(ORDER_NUMBER).build());

        Claim completedClaim = Claim.builder()
                .orderLineItemId(201L).memberId(MEMBER_ID).productName("상품 D")
                .claimType(Claim.ClaimType.EXCHANGE).reason("이유2").claimAmount(20000L).claimQuantity(2L).orderNumber(ORDER_NUMBER).build();
        completedClaim.complete(); // 상태를 COMPLETED로 변경
        claimRepository.save(completedClaim);

        // 검색 조건 세팅: RETURN 상태만 검색
        ClaimSearchCondition condition = new ClaimSearchCondition(null, null, Claim.ClaimType.RETURN, null, MEMBER_ID, null);

        // when
        Page<ClaimResponse> result = claimService.getClaimHistory(MEMBER_ID, condition, PageRequest.of(0, 10));

        // then: 2개 중 조건에 맞는 1개만 조회되어야 함
        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).claimType()).isEqualTo(Claim.ClaimType.RETURN);
    }

    // 클레임 철회 테스트

    @Test
    @DisplayName("클레임 철회 성공 - 상태가 WITHDRAWN으로 변경되고 이벤트가 정확히 1번 발행된다")
    void withdrawClaim_Success_And_EventPublished() {
        // given: REQUESTED 상태의 클레임 저장
        Claim claim = Claim.builder()
                .orderLineItemId(300L).memberId(MEMBER_ID).productName("상품 E")
                .claimType(Claim.ClaimType.CANCEL).reason("단순 변심").claimAmount(30000L)
                .claimQuantity(1L).orderNumber(ORDER_NUMBER).build();
        claimRepository.save(claim);

        // when
        claimService.withdrawClaim(MEMBER_ID, claim.getId());

        // then 1: DB 상태 변경 확인
        Claim withdrawnClaim = claimRepository.findById(claim.getId()).get();
        assertThat(withdrawnClaim.getClaimStatus()).isEqualTo(Claim.ClaimStatus.WITHDRAWN);

        // then 2: ★ @RecordApplicationEvents를 활용하여 이벤트 발행 검증
        long eventCount = applicationEvents.stream(ClaimWithdrawnEvent.class).count();
        assertThat(eventCount).isEqualTo(1); // 트랜잭션 내에서 이벤트가 딱 1번 발행되었는지 확인

        ClaimWithdrawnEvent publishedEvent = applicationEvents.stream(ClaimWithdrawnEvent.class).findFirst().get();
        assertThat(publishedEvent.claimId()).isEqualTo(claim.getId());
    }

    @Test
    @DisplayName("클레임 철회 실패 - 본인의 클레임이 아닌 경우 접근 권한 예외가 발생한다")
    void withdrawClaim_Fail_AccessDenied() {
        // given: 멤버 1의 클레임 생성
        Claim claim = Claim.builder()
                .orderLineItemId(400L).memberId(MEMBER_ID).productName("상품 F")
                .claimType(Claim.ClaimType.RETURN).reason("환불").claimAmount(40000L)
                .claimQuantity(1L).orderNumber(ORDER_NUMBER).build();
        claimRepository.save(claim);

        Long otherMemberId = 999L;

        // when & then: 다른 멤버 ID로 철회 시도
        assertThatThrownBy(() -> claimService.withdrawClaim(otherMemberId, claim.getId()))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.ACCESS_DENIED);
    }
}