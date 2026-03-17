package com.team_e_commerce.support.backoffice.service;

import com.team_e_commerce.support.backoffice.domain.AdminActivityLog;
import com.team_e_commerce.support.backoffice.domain.AdminActivityLogRepository;
import com.team_e_commerce.support.backoffice.dto.AdminLogRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminActivityLogService {

    private final AdminActivityLogRepository adminActivityLogRepository;

    @Transactional
    public void recordActivity(Long adminId, AdminLogRequest request) {
        AdminActivityLog log = AdminActivityLog.builder()
                .adminId(adminId)
                .role(request.role())
                .actionType(request.actionType())
                .targetId(request.targetId())
                .actionDetails(request.actionDetails())
                .build();

        adminActivityLogRepository.save(log);
    }
}