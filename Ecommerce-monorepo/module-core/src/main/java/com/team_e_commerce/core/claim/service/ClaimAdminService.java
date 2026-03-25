package com.team_e_commerce.core.claim.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.team_e_commerce.common.exception.BusinessException;
import com.team_e_commerce.common.exception.ErrorCode;
import com.team_e_commerce.common.dto.AdminClaimHistoryRequestDto;
import com.team_e_commerce.core.claim.dto.ClaimResponse;
import com.team_e_commerce.core.claim.dto.ClaimSearchCondition;
import com.team_e_commerce.core.claim.entity.Claim;
import com.team_e_commerce.core.infrastructure.redis.outbox.EventOutbox;
import com.team_e_commerce.core.claim.repository.ClaimRepository;
import com.team_e_commerce.core.infrastructure.redis.outbox.EventOutboxRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClaimAdminService {

    private final ClaimRepository claimRepository;
    private final EventOutboxRepository eventOutboxRepository;
    private final ObjectMapper objectMapper;

    // Facade 검증용 단순 조회 (Read-Only)
    @Transactional(readOnly = true)
    public Claim getClaimForValidation(Long claimId) {
        return claimRepository.findById(claimId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CLAIM_NOT_FOUND));
    }

    // 관리자(Admin) 전체 클레임 내역 조회
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public Page<ClaimResponse> getAllClaimsForAdmin(ClaimSearchCondition condition, Pageable pageable) {
        // 1. 관리자용 Repository 메서드 호출 (memberId 파라미터 없음)
        Page<Claim> claimPage = claimRepository.searchClaims(condition, pageable);

        // 2. DTO 변환 및 반환
        return claimPage.map(ClaimResponse::from);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void completeClaimAndSaveHistory(Long adminId, Long claimId) {
        Claim claim = claimRepository.findByIdForUpdate(claimId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CLAIM_NOT_FOUND));

        String previousStatus = claim.getClaimStatus().name();
        claim.complete();

        saveAdminHistoryOutbox(adminId, claim, previousStatus, "APPROVE", null);
        log.info("관리자 클레임 승인 완료 (DB 상태 변경 및 이력 아웃박스 저장) - claimId: {}", claimId);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void rejectClaimAndSaveHistory(Long adminId, Long claimId, String rejectReason) {
        Claim claim = claimRepository.findByIdForUpdate(claimId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CLAIM_NOT_FOUND));

        String previousStatus = claim.getClaimStatus().name();
        claim.reject(rejectReason);

        saveAdminHistoryOutbox(adminId, claim, previousStatus, "REJECT", rejectReason);
        log.info("관리자 클레임 거절 완료 - claimId: {}", claimId);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void startProcessingClaim(Long adminId, Long claimId) {
        Claim claim = claimRepository.findByIdForUpdate(claimId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CLAIM_NOT_FOUND));

        String previousStatus = claim.getClaimStatus().name();
        claim.startProcessing();

        saveAdminHistoryOutbox(adminId, claim, previousStatus, "START_PROCESSING", null);
        log.info("관리자 클레임 처리 시작 완료 - claimId: {}", claimId);
    }

    // Facade에서 DB 커밋 실패 시 보상 트랜잭션으로 호출되는 메서드
    @Transactional
    public void markAsManualCheckRequired(Long claimId) {
        Claim claim = claimRepository.findByIdForUpdate(claimId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CLAIM_NOT_FOUND));
        claim.markAsManualCheckRequired();
    }

    // 이력 아웃박스 저장 공통 헬퍼 메서드
    private void saveAdminHistoryOutbox(Long adminId, Claim claim, String previousStatus, String actionType, String rejectReason) {
        AdminClaimHistoryRequestDto historyDto = new AdminClaimHistoryRequestDto(
                adminId, claim.getId(), claim.getOrderNumber(),
                previousStatus, claim.getClaimStatus().name(),
                actionType, rejectReason
        );

        try {
            String payload = objectMapper.writeValueAsString(historyDto);
            EventOutbox outbox = EventOutbox.builder()
                    .eventType("ADMIN_HISTORY_RECORD")
                    .payload(payload)
                    .build();
            eventOutboxRepository.save(outbox);
        } catch (JsonProcessingException e) {
            log.error("Outbox payload 직렬화 실패 - eventType: ADMIN_HISTORY_RECORD", e);
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}