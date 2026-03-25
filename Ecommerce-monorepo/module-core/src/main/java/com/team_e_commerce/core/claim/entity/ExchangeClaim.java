package com.team_e_commerce.core.claim.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@DiscriminatorValue("EXCHANGE")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class ExchangeClaim extends Claim {

    // 1. 수거 정보 (고객 -> 물류센터)
    @Column(name = "return_address")
    private String returnAddress;

    @Column(name = "return_tracking_number", length = 100)
    private String returnTrackingNumber;

    // 2. 재배송 정보 (물류센터 -> 고객)
    @Column(name = "reship_address")
    private String reshipAddress;

    @Column(name = "reship_tracking_number", length = 100)
    private String reshipTrackingNumber;
}