package com.team_e_commerce.core.claim.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@DiscriminatorValue("CANCEL")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class CancelClaim extends Claim {
    // 취소는 물리적 배송이 없으므로 추가 필드 없이 깔끔하게 유지됩니다.
}