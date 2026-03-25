package com.team_e_commerce.core.payment.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.team_e_commerce.core.payment.entity.Payment;
import com.team_e_commerce.core.payment.entity.PaymentMethod;
import com.team_e_commerce.core.payment.repository.PaymentRepository;
import com.team_e_commerce.core.infrastructure.redis.outbox.EventOutbox;
import com.team_e_commerce.core.infrastructure.redis.outbox.EventOutboxRepository;
// import com.team_e_commerce.common.exception.CustomException; // 실제 사용하는 공통 예외 클래스로 임포트해주세요
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final EventOutboxRepository eventOutboxRepository;
    private final MockPaymentProcessor mockPaymentProcessor;
    private final RedissonClient redissonClient;
    private final ObjectMapper objectMapper; // 추가됨

    @Transactional
    public Payment processPayment(Long orderId, Long memberId, Long amount, PaymentMethod method) {
        String lockKey = "lock:payment:order:" + orderId;
        RLock lock = redissonClient.getLock(lockKey);

        try {
            boolean isLocked = lock.tryLock(0, 5, TimeUnit.SECONDS);
            if (!isLocked) {
                log.warn("중복 결제 요청 발생 - orderId: {}", orderId);
                throw new IllegalStateException("이미 처리 중인 결제입니다.");
            }

            Payment payment = Payment.builder()
                    .orderId(orderId)
                    .memberId(memberId)
                    .amount(amount)
                    .paymentMethod(method)
                    .build();
            paymentRepository.save(payment);

            MockPaymentProcessor.PaymentResult result = mockPaymentProcessor.process(amount);

            if (result.isSuccess()) {
                payment.complete();

                try {
                    // Map.of를 활용한 안전한 JSON 직렬화
                    String payload = objectMapper.writeValueAsString(
                            Map.of("orderId", orderId, "paymentId", payment.getId())
                    );

                    // 빌더에서 published(false) 등 불필요한 설정 제거
                    EventOutbox outbox = EventOutbox.builder()
                            .eventType("PAYMENT_COMPLETED")
                            .payload(payload)
                            .build();

                    eventOutboxRepository.saveAll(List.of(outbox));
                    log.info("결제 성공 - orderId: {}, paymentId: {}", orderId, payment.getId());



                } catch (JsonProcessingException e) {
                    // TODO: 프로젝트 실제 공통 예외 클래스로 변경해 주세요
                    throw new RuntimeException("이벤트 페이로드 직렬화 실패", e);
                }

            } else {
                // 1. 엔티티 상태를 FAILED로 변경하고 사유 기록
                payment.fail(result.failReason());

                try {
                    // 2. 실패 사유를 포함하여 페이로드 구성
                    String payload = objectMapper.writeValueAsString(
                            Map.of(
                                    "orderId", orderId,
                                    "paymentId", payment.getId(),
                                    "failReason", result.failReason()
                            )
                    );

                    // 3. PAYMENT_FAILED 이벤트 아웃박스 생성
                    EventOutbox outbox = EventOutbox.builder()
                            .eventType("PAYMENT_FAILED")
                            .payload(payload)
                            .build();

                    // 4. 정상 저장 (트랜잭션 커밋 유도)
                    eventOutboxRepository.saveAll(List.of(outbox));
                    log.info("결제 실패 및 보상 트랜잭션 이벤트 발행 - orderId: {}, 사유: {}", orderId, result.failReason());

                } catch (JsonProcessingException e) {
                    // 시스템 내부 직렬화 에러 시에만 런타임 예외 발생
                    throw new RuntimeException("결제 실패 이벤트 페이로드 직렬화 실패", e);
                }

            }

            return payment;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("결제 처리 중 락 획득 실패", e);
        } finally {
            if (lock.isLocked() && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    @Transactional
    public Payment cancelPayment(Long orderId, Long paymentId, Long cancelAmount) {
        // 결제와 동일한 락 키 사용 (동시 결제/취소 충돌 방지)
        String lockKey = "lock:payment:order:" + orderId;
        RLock lock = redissonClient.getLock(lockKey);

        try {
            boolean isLocked = lock.tryLock(0, 5, TimeUnit.SECONDS);
            if (!isLocked) {
                log.warn("동시 결제/취소 요청 발생 - orderId: {}", orderId);
                throw new IllegalStateException("현재 해당 주문에 대한 다른 처리가 진행 중입니다.");
            }

            // 1. DB 조회 및 파라미터 교차 검증
            Payment payment = paymentRepository.findById(paymentId)
                    .orElseThrow(() -> new IllegalArgumentException("결제 내역을 찾을 수 없습니다."));

            if (!payment.getOrderId().equals(orderId)) {
                throw new IllegalArgumentException("요청된 주문과 결제 정보가 일치하지 않습니다.");
            }

            // 2. 외부(Mock) 취소 진행
            MockPaymentProcessor.PaymentResult result = mockPaymentProcessor.cancelProcess(cancelAmount);

            // 3. 엔티티 상태 변경 및 아웃박스 이벤트 발행
            if (result.isSuccess()) {
                payment.cancel(cancelAmount);

                try {
                    // 페이로드에 취소된 금액과 최종 상태(부분취소/완전취소)를 함께 담음
                    String payload = objectMapper.writeValueAsString(
                            Map.of(
                                    "orderId", orderId,
                                    "paymentId", paymentId,
                                    "cancelAmount", cancelAmount,
                                    "status", payment.getStatus().name()
                            )
                    );

                    EventOutbox outbox = EventOutbox.builder()
                            .eventType("PAYMENT_CANCELED")
                            .payload(payload)
                            .build();

                    eventOutboxRepository.saveAll(List.of(outbox));
                    log.info("결제 취소 성공 - orderId: {}, paymentId: {}, 취소금액: {}", orderId, paymentId, cancelAmount);

                } catch (JsonProcessingException e) {
                    throw new RuntimeException("취소 이벤트 페이로드 직렬화 실패", e);
                }
            } else {
                throw new IllegalStateException("PG사 결제 취소에 실패했습니다.");
            }

            return payment;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("결제 취소 처리 중 락 획득 실패", e);
        } finally {
            if (lock.isLocked() && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

}