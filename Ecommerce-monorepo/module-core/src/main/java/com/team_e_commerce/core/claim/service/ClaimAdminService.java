package com.team_e_commerce.core.claim.service;

import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import com.team_e_commerce.core.claim.client.PaymentInternalClient;
import com.team_e_commerce.core.claim.client.SupportInternalClient;
import com.team_e_commerce.core.claim.client.dto.AdminClaimHistoryRequestDto;
import com.team_e_commerce.core.claim.domain.Claim;
import com.team_e_commerce.core.claim.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClaimAdminService {

    private final ClaimRepository claimRepository;
    private final PaymentInternalClient paymentInternalClient;
    private final SupportInternalClient supportInternalClient;

    @Retryable(
            value = Exception.class,
            exclude = BusinessException.class,
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000)
    )
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void approveClaim(Long adminId, Long claimId) {
        Claim claim = claimRepository.findByIdForUpdate(claimId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CLAIM_NOT_FOUND));

        String previousStatus = claim.getClaimStatus().name();
        claim.complete();
        paymentInternalClient.cancelPayment(claim.getOrderLineItemId(), claim.getClaimAmount());

        AdminClaimHistoryRequestDto historyDto = new AdminClaimHistoryRequestDto(
                adminId, claim.getId(), claim.getOrderNumber(),
                previousStatus, claim.getClaimStatus().name(),
                "APPROVE", null
        );
        supportInternalClient.sendAdminHistory(historyDto);

        log.info("관리자 클레임 승인 완료 (결제 취소 및 이력 전송 성공) - claimId: {}, adminId: {}", claimId, adminId);
    }

    @Retryable(
            value = Exception.class,
            exclude = BusinessException.class, // ★ 개선 1 적용
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000)
    )
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void rejectClaim(Long adminId, Long claimId, String rejectReason) {
        Claim claim = claimRepository.findByIdForUpdate(claimId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CLAIM_NOT_FOUND));

        String previousStatus = claim.getClaimStatus().name();
        claim.reject(rejectReason);

        AdminClaimHistoryRequestDto historyDto = new AdminClaimHistoryRequestDto(
                adminId, claim.getId(), claim.getOrderNumber(),
                previousStatus, claim.getClaimStatus().name(),
                "REJECT", rejectReason
        );
        supportInternalClient.sendAdminHistory(historyDto);

        log.info("관리자 클레임 거절 완료 - claimId: {}, adminId: {}", claimId, adminId);
    }

    @Retryable(
            value = Exception.class,
            exclude = BusinessException.class, // 도메인 예외는 재시도 제외
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000)
    )
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void startProcessingClaim(Long adminId, Long claimId) {

        Claim claim = claimRepository.findByIdForUpdate(claimId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CLAIM_NOT_FOUND));

        String previousStatus = claim.getClaimStatus().name();

        claim.startProcessing();

        AdminClaimHistoryRequestDto historyDto = new AdminClaimHistoryRequestDto(
                adminId, claim.getId(), claim.getOrderNumber(),
                previousStatus, claim.getClaimStatus().name(),
                "START_PROCESSING", null
        );
        supportInternalClient.sendAdminHistory(historyDto);

        log.info("관리자 클레임 처리 시작 (이력 전송 성공) - claimId: {}, adminId: {}", claimId, adminId);
    }

    @Recover
    public void recoverStartProcessingClaim(Exception e, Long adminId, Long claimId) {
        log.error("[Recovery: CRITICAL] 관리자 클레임 처리 시작 3회 재시도 모두 실패! 수동 복구 필요 - claimId: {}, adminId: {}", claimId, adminId, e);

        throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    @Recover
    public void recoverApproveClaim(Exception e, Long adminId, Long claimId) {
        log.error("[Recovery: CRITICAL] 관리자 클레임 승인 3회 재시도 모두 실패! 수동 복구 필요 - claimId: {}, adminId: {}", claimId, adminId, e);


        throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }

    @Recover
    public void recoverRejectClaim(Exception e, Long adminId, Long claimId, String rejectReason) {
        log.error("[Recovery: CRITICAL] 관리자 클레임 거절 3회 재시도 모두 실패! 수동 복구 필요 - claimId: {}, adminId: {}, reason: {}", claimId, adminId, rejectReason, e);

        throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
}