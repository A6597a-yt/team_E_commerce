package com.team_e_commerce.core.payment.repository;

import com.team_e_commerce.core.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}