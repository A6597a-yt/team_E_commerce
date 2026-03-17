package com.team_E_commerce.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseTimeEntity {

    @CreatedDate
    @Column(updatable = false, nullable = false)
    // 최초 생성 시간
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    // 마지막 수정 시간
    protected
    LocalDateTime updatedAt;
}