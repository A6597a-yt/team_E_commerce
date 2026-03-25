package com.team_e_commerce.core.claim.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@DiscriminatorValue("RETURN")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class ReturnClaim extends Claim {

    @Column(name = "return_address")
    private String returnAddress;

    @Column(name = "return_tracking_number", length = 100)
    private String returnTrackingNumber;

    // 운송장 번호 등록 등 반품 전용 로직을 향후 여기에 추가
    public void registerTrackingNumber(String trackingNumber) {
        this.returnTrackingNumber = trackingNumber;
    }
}