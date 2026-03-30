const contentData = [
    { 
        id: 'arch', 
        title: 'Modular Monolith', 
        p: '단일 프로젝트 내에서 도메인(Member, Order 등) 간 JPA 객체 직접 참조(Hard Reference)가 발생하면, 특정 도메인의 변경이 시스템 전체로 전파되어 결합도가 상승하고 향후 MSA 분리가 불가능해집니다.', 
        s: 'Gradle 멀티 모듈(core, catalog-member, support, common, bootstrap)로 물리적 구조를 분리하고, 타 도메인은 식별자(ID)로만 참조하는 Soft Reference 패턴을 적용해 도메인 독립성을 확보했습니다.', 
        code: `// 1. settings.gradle (물리적 모듈 분리)
include 'module-bootstrap'      // 실행 모듈
include 'module-core'           // 주문, 결제, 클레임 등 핵심 도메인
include 'module-catalog-member' // 상품, 카테고리, 회원 도메인
include 'module-support'        // 외부 연동 및 관리자 기능
include 'module-common'         // 공통 유틸 및 예외 처리

// =========================================================

// 2. 안티 패턴: Hard Reference (도메인 강결합)

@ManyToOne(fetch = FetchType.LAZY) // 현재 entity(예: 주문)와 대상 entity(member)가 다대일 관계임을 jpa에 선언 
@JoinColumn(name = "member_id") // 두 테이블 간에 데이터베이스 수준의 조인(JOIN) 관계가 형성
private Member member; // Core 모듈이 Catalog-Member 모듈을 직접 참조함


// =========================================================

// 3. 해결: Soft Reference 기반 설계 (module-core / Order.java)
@Entity
@Table(name = "orders")
public class Order extends BaseEntity {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 타 모듈(Member)은 엔티티 객체 대신 ID만 보유 (느슨한 결합)
    @Column(name = "member_id", nullable = false)
    private Long memberId;

    // 동일 모듈(Core) 내부에 속한 엔티티는 객체 참조(Hard Reference) 허용
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderLineItem> lineItems = new ArrayList<>();
    
    // ...
}` 
    },
    { 
        id: 'lock', 
        title: 'Optimistic Locking & Stock Allocation', 
        p: '다수의 사용자가 동시에 동일한 상품을 결제할 때 제어 장치가 없으면 초과 결제(Race Condition)가 발생합니다. 비관적 락(Row Lock)을 걸면 병목 현상으로 성능이 저하되며, 단순히 결제 완료 시점에만 재고를 차감하면 결제 진행 중인(대기) 상태의 재고를 제어할 수 없습니다.', 
        s: '이커머스 환경에서는 심각한 병목 현상과 전체 시스템 응답 속도 저하를 유발하기에 JPA의 @Version을 활용한 낙관적 락(Optimistic Lock)을 도입하여 DB 부하를 최소화했습니다. 또한, 재고를 전체 재고(totalQuantity)와 점유 재고(allocatedQuantity)로 분리하고, 결제 진입 시점(allocateStock)과 완료 시점(deductAllocated)으로 로직을 세분화하여 정교한 재고 관리를 구현했습니다.', 
        code: `// 1. 엔티티에 버전 관리 및 세분화된 재고 필드 추가 (module-core / Inventory.java)
@Entity
public class Inventory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long allocatedQuantity; // 결제 대기 중인 점유 재고
    private Long totalQuantity;     // 전체 실제 물리적 재고

    // ★ 낙관적 락의 핵심: 데이터 수정 시 자동으로 1씩 증가
    @Version
    private Long version;

    public Long getAvailableQuantity() {
        return this.totalQuantity - this.allocatedQuantity; // 가용 재고
    }

    // 2-1. 결제 진입 시점: 재고 점유 (낙관적 락 경합 발생 지점)
    public void allocateStock(Long quantity) {
        if (getAvailableQuantity() < quantity) {
            throw new BusinessException(ErrorCode.OUT_OF_STOCK);
        }
        this.allocatedQuantity += quantity;
    }

    // 2-2. 결제 완료 시점: 실제 재고 차감
    public void deductAllocated(Long quantity) {
        if (this.allocatedQuantity < quantity || this.totalQuantity < quantity) {
            throw new BusinessException(ErrorCode.OUT_OF_STOCK);
        }
        this.allocatedQuantity -= quantity;
        this.totalQuantity -= quantity;
    }
}

// =========================================================

// 3. JPA 내부 동작 원리 및 충돌 감지 (allocateStock 호출 시)
/*
[Transaction A와 B가 동시에 version 1인 재고를 조회하여 점유 시도]

Transaction A의 업데이트 시도:
UPDATE inventory 
SET allocated_quantity = 1, version = 2 
WHERE id = 1 AND version = 1; 
-> 성공 (version이 2로 변경됨)

Transaction B의 업데이트 시도:
UPDATE inventory 
SET allocated_quantity = 1, version = 2 
WHERE id = 1 AND version = 1; 
-> 실패 (A가 이미 version을 2로 바꿨으므로 조건에 맞는 row가 0개)
-> 즉각적으로 ObjectOptimisticLockingFailureException 예외 발생!
*/` 
    },
    { 
        id: 'retry', 
        title: 'Retry Facade Pattern', 
        p: '낙관적 락(Optimistic Lock)은 충돌 발생 시 예외(Exception)를 던집니다. 이를 그대로 방치하면 사용자는 결제 중 튕김 현상을 겪게 되어 사용자 경험(UX)이 심각하게 훼손됩니다.', 
        s: '비즈니스 로직과 트랜잭션을 분리하는 Facade 계층을 추가했습니다. 충돌(ObjectOptimisticLockingFailureException) 발생 시 백그라운드에서 50ms 대기 후 최대 30회까지 재고 점유(allocateStock)를 자동 재시도하여 사용자 모르게 충돌을 복구합니다.', 
        code: `// 1. 재시도 전용 Facade 클래스 구현 (module-core / InventoryRetryFacade.java)
@Component
@RequiredArgsConstructor
public class InventoryRetryFacade {

    private final InventoryService inventoryService;
    private static final int MAX_RETRIES = 30;  // 최대 30번 재시도
    private static final int WAIT_TIME_MS = 50; // 0.05초 대기

    public void decreaseStockWithRetry(Long inventoryId, Long quantity) {
        int attempt = 0;
        
        while (attempt < MAX_RETRIES) {
            try {
                // 핵심 비즈니스 로직 (재고 점유) 호출
                inventoryService.allocateStock(inventoryId, quantity);
                return; // 성공 시 루프 탈출 및 정상 종료
                
            } catch (ObjectOptimisticLockingFailureException e) {
                // 낙관적 락 충돌 감지 시 재시도 로직 수행
                attempt++;
                
                if (attempt >= MAX_RETRIES) {
                    // 30회 모두 실패 시 서버 에러 반환
                    throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
                }
                
                try {
                    Thread.sleep(WAIT_TIME_MS); // 50ms 대기 후 재시도
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }
}

// =========================================================

// 2. 주문 서비스에서의 활용 (module-core / OrderService.java)
@Service
@RequiredArgsConstructor
public class OrderService {
    
    // InventoryService가 아닌 RetryFacade를 주입받음
    private final InventoryRetryFacade inventoryRetryFacade;

    @Transactional
    public void createOrder(Long inventoryId, Long quantity) {
        // ... (생략) ...
        
        // 락 충돌 시 자동 재시도가 적용된 메서드 호출
        inventoryRetryFacade.decreaseStockWithRetry(inventoryId, quantity);
        
        // ... (주문 생성 및 결제 대기 로직) ...
    }
}` 
    },
    { 
        id: 'saga', 
        title: 'Saga Pattern (Event-Driven)', 
        p: '모듈이 분리된 환경에서는 단일 DB의 @Transactional 롤백에 의존할 수 없습니다. 주문 성공 후 외부 결제(PG) 연동에서 예외가 발생할 경우, 이미 차감 처리된 재고나 사용된 쿠폰을 자동으로 되돌릴 수 없는 분산 트랜잭션 한계가 존재합니다.', 
        s: '물리적 롤백 대신 애플리케이션 레벨의 Saga 패턴(보상 트랜잭션)을 도입했습니다. 결제 실패 시 PaymentCancelEvent를 비동기로 발행하고, 각 도메인의 리스너가 이를 구독하여 재고를 다시 증가시키고 주문 상태를 취소로 변경함으로써 최종적 일관성(Eventual Consistency)을 보장합니다.', 
        code: `// 1. 트랜잭션 실패 시 보상 이벤트 발행 (Saga 시작점)
@Service
public class OrderFacade {
    @Transactional
    public void processOrder(OrderRequest req) {
        orderService.createOrder(req);
        inventoryService.decreaseStock(req.getProductId(), req.getQty()); // 재고 선차감
        
        try {
            paymentService.processPayment(req.getOrderId(), req.getAmount());
        } catch (Exception e) {
            // 외부 연동 실패 시 물리적 롤백 대신 이벤트 발행
            eventPublisher.publishEvent(new PaymentCancelEvent(req.getOrderId(), req.getProductId(), req.getQty()));
            throw new BusinessException(ErrorCode.PAYMENT_FAILED);
        }
    }
}

// =========================================================

// 2. 보상 트랜잭션 처리 리스너 (각 도메인의 정합성 복구)
@Component
@RequiredArgsConstructor
public class SagaEventListener {

    private final InventoryService inventoryService;
    private final OrderService orderService;

    // 트랜잭션 롤백 이후에 보상 로직 실행 보장
    @TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handlePaymentCancel(PaymentCancelEvent event) {
        // 3. 차감되었던 재고 복구 (보상 동작)
        inventoryService.increaseStock(event.getProductId(), event.getQuantity());
        
        // 4. 주문 상태를 '결제 실패(취소)'로 업데이트
        orderService.updateOrderStatus(event.getOrderId(), OrderStatus.CANCELED);
    }
}` 
    },
    { 
        id: 'snap', 
        title: 'Data Snapshot Strategy', 
        p: '상품 정보(이름, 가격, 옵션 등)는 판매자에 의해 언제든 변경될 수 있습니다. 만약 주문 내역이 상품 테이블을 조인해서 가져오는 구조라면, 구매자가 1년 전 주문서를 조회했을 때 현재 변경된 상품명과 가격이 노출되는 치명적인 데이터 정합성 오류가 발생합니다.', 
        s: '주문 결제 시점의 상품 정보를 불변 데이터로 영구 보존하는 스냅샷(Snapshot) 패턴을 적용했습니다. 복잡한 옵션 정보는 JPA AttributeConverter를 활용해 JSON 문자열로 직렬화하여 DB의 TEXT 컬럼에 저장함으로써 마스터 데이터 변경에 영향을 받지 않도록 설계했습니다.', 
        code: `// 1. JSON 변환기 구현 (AttributeConverter)
@Converter
public class OrderOptionConverter implements AttributeConverter<Map<String, String>, String> {
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, String> attribute) {
        try {
            // Map 데이터를 JSON 문자열로 직렬화하여 DB에 저장
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("JSON 직렬화 에러");
        }
    }

    @Override
    public Map<String, String> convertToEntityAttribute(String dbData) {
        // ... 역직렬화 로직 (JSON -> Map)
    }
}

// =========================================================

// 2. 주문 상세 엔티티에 스냅샷 적용 (module-core / OrderLineItem.java)
@Entity
public class OrderLineItem {
    @Id @GeneratedValue
    private Long id;

    private Long productId;

    // ★ 과거 데이터 박제: 결제 시점의 단가와 상품명을 독립적으로 저장
    private Integer orderPrice; 
    private String productName;

    // ★ 복잡한 옵션(사이즈, 색상 등)은 JSON 문자열로 통째로 저장
    @Convert(converter = OrderOptionConverter.class)
    @Column(columnDefinition = "TEXT")
    private Map<String, String> optionSnapshot;
}` 
    },
    { 
        id: 'redis', 
        title: 'Redis Caching & TTL', 
        p: '장바구니는 사용자가 상품을 담고 빼는 수정 작업과 조회가 매우 빈번하게 일어나는 도메인입니다. 이를 매번 RDB(관계형 데이터베이스)에서 처리하면 디스크 I/O 비용이 발생하여 전체 시스템 성능과 응답 속도가 저하됩니다.', 
        s: '장바구니 데이터를 인메모리(In-Memory) 데이터 저장소인 Redis로 이관하여 성능을 극대화했습니다. Spring Data Redis의 @RedisHash와 CrudRepository를 활용해 구현했으며, 만료 시간(TTL)을 7일(604800초)로 설정하여 미사용 데이터로 인한 메모리 낭비를 방지했습니다.', 
        code: `// 1. Redis 전용 장바구니 엔티티 (module-catalog-member / Cart.java)
// timeToLive = 604800초 (7일) 설정으로 자동 메모리 반환
@RedisHash(value = "cart", timeToLive = 604800)
public class Cart {
    @Id
    private Long memberId;
    
    // 장바구니에 담긴 상품(옵션) 목록
    private List<CartItem> items = new ArrayList<>();
    
    // ... 생성자 및 비즈니스 로직 생략 ...
}

// =========================================================

// 2. Spring Data Redis Repository 인터페이스
public interface CartRepository extends CrudRepository<Cart, Long> {
}

// =========================================================

// 3. 장바구니 서비스 로직 (module-catalog-member / CartService.java)
@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CartRepository cartRepository;

    public void updateCartItem(Long memberId, CartItem newItem) {
        // 1) 전체 장바구니 객체를 메모리로 조회 (없으면 새로 생성)
        Cart cart = cartRepository.findById(memberId)
                .orElse(new Cart(memberId));
            
        // 2) 자바 컬렉션(List) 레벨에서 수량 변경 또는 상품 추가
        cart.updateOrAddItem(newItem);
        
        // 3) 변경된 전체 객체를 덮어쓰기 (Save)
        cartRepository.save(cart);
    }
}` 
    },
    { 
        id: 'mdc', 
        title: 'MDC Trace Logging', 
        p: '멀티 스레드 및 분산 환경에서 여러 사용자의 API 요청이 동시에 쏟아지면 서버 로그가 뒤섞이게 됩니다. 이로 인해 에러 발생 시 특정 사용자의 요청이 컨트롤러에서 레포지토리까지 어떻게 흘러갔는지 문맥(Context)을 추적하기가 매우 어렵습니다.', 
        s: 'SLF4J의 MDC(Mapped Diagnostic Context)를 도입했습니다. 최우선 순위 필터(OncePerRequestFilter)에서 요청 진입 시 고유한 12자리 Trace ID를 발급하여 스레드 로컬에 저장하고, 스레드 반납 시점(finally)에 MDC.remove()를 호출해 메모리 누수와 데이터 오염을 확실하게 방지했습니다.', 
        code: `// 1. 요청의 가장 앞단에서 동작하는 로깅 필터 (module-common / MdcLoggingFilter.java)
@Component
@Order(Ordered.HIGHEST_PRECEDENCE) // 최우선 순위 적용
public class MdcLoggingFilter extends OncePerRequestFilter {

    private static final String TRACE_ID = "traceId";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // 하이픈 제거 후 12자리의 고유 Trace ID 발급
        String traceId = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        MDC.put(TRACE_ID, traceId);

        try {
            // 다음 필터 및 디스패처 서블릿으로 요청 전달
            filterChain.doFilter(request, response);
        } finally {
            // ★ 핵심: 스레드 풀 환경에서 이전 데이터 잔존 및 메모리 누수를 방지하기 위한 확실한 자원 정리
            MDC.remove(TRACE_ID);
        }
    }
}

// =========================================================

// 2. 개발 및 디버깅 활용 팁 (rule.txt 공통 규약)
/*
모든 API 요청은 필터 단에서 고유한 traceId를 발급받습니다.
개발 중 log.info()나 log.error()를 찍으시면 로그백 패턴의 [%X{traceId}]를 통해 
아래와 같이 모든 로그에 ID가 자동 출력되니 디버깅 시 적극 활용해 주세요!

[출력 예시]
2026-03-30 11:15:00 [INFO] [8a3b9c2d1e4f] [OrderService] - 주문 생성 시작...
2026-03-30 11:15:01 [ERROR] [8a3b9c2d1e4f] [InventoryService] - 재고 부족 예외 발생!
*/` 
    },
    { 
        id: 'error', 
        title: 'Global Exception Handling', 
        p: '각 컨트롤러마다 try-catch로 예외를 개별 처리하면 중복 코드가 양산될 뿐만 아니라, 에러 응답 규격이 파편화되어 프론트엔드에서 공통적인 에러 핸들링(Toast 알림, 필드 검증 에러 표시 등)을 수행하기가 매우 까다로워집니다.', 
        s: '@RestControllerAdvice를 활용해 전역 예외 처리기를 구축하여 API 응답 규격을 하나로 통일했습니다. 특히 도메인별 고유 에러 코드(예: INV-001)를 도입하여 에러의 원인을 즉각 식별할 수 있게 했으며, 요청 경로와 발생 시각을 포함해 디버깅 효율을 극대화했습니다.', 
        code: `// 1. 도메인별 고유 코드를 포함한 에러 정의 (module-common / ErrorCode.java)
@Getter
public enum ErrorCode {
    OUT_OF_STOCK(HttpStatus.CONFLICT, "INV-001", "상품의 재고가 부족합니다."),
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "ORD-001", "주문 내역을 찾을 수 없습니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "SYS-001", "서버 내부 오류가 발생했습니다.");

    private final HttpStatus httpStatus;
    private final String code;    // ★ 프론트와 약속한 고유 식별 코드
    private final String message; // ★ 사용자에게 노출할 친절한 문구

    ErrorCode(HttpStatus httpStatus, String code, String message) {
        this.httpStatus = httpStatus;
        this.code = code;
        this.message = message;
    }
}

// =========================================================

// 2. 통신 규약을 준수한 공통 응답 객체 (module-common / ErrorResponse.java)
@Getter @Builder
public class ErrorResponse {
    private final String timestamp; // 발생 시각
    private final int status;       // HTTP 상태 코드
    private final String code;      // 에러 코드 (INV-001 등)
    private final String message;   // 에러 메시지
    private final String path;      // 요청 API 경로
    private final List<FieldErrorDetail> errors; // 필드별 상세 에러 (선택)

    public static ErrorResponse of(ErrorCode errorCode, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")))
                .status(errorCode.getHttpStatus().value())
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .path(path)
                .build();
    }
}

// =========================================================

// 3. 전역 예외 처리기 구현 (module-common / GlobalExceptionHandler.java)
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e, HttpServletRequest request) {
        ErrorCode errorCode = e.getErrorCode();
        
        // 정적 팩토리 메서드를 통해 규격화된 ErrorResponse 생성
        ErrorResponse response = ErrorResponse.of(errorCode, request.getRequestURI());

        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(response);
    }
}` 
    },
    { 
        id: 'jwt', 
        title: 'Stateless Auth (JJWT)', 
        p: '서버 확장성을 위해 세션(Session) 대신 JWT(JSON Web Token) 기반의 Stateless 인증을 도입했습니다. 하지만 올바른 서명 검증 로직이 없으면 악의적인 사용자가 토큰을 위조하여 타인의 계정을 탈취할 위험이 있습니다.', 
        s: '최신 사양의 JJWT 라이브러리(0.12.x)를 적용하여 강력한 보안을 구축했습니다. 환경 설정 파일에서 주입받은 Secret 값을 Keys.hmacShaKeyFor()로 안전한 암호화 키 객체로 변환하고, verifyWith()를 통해 서명 불일치 및 토큰 만료를 엄격하게 검증하여 위변조 공격을 원천 차단했습니다.', 
        code: `// 1. application.yml (설정 분리)
jwt:
  secret: "this-is-a-very-secure-secret-key-for-jwt-must-be-long-enough-for-hs256"
  access-token-validity-in-seconds: 3600

// =========================================================

// 2. 최신 JJWT 스펙을 적용한 토큰 프로바이더 (module-common / JwtProvider.java)
@Component
public class JwtProvider {

    private final SecretKey secretKey;
    private final long accessTokenValidityInMilliseconds;

    public JwtProvider(
            @Value("\${jwt.secret}") String secret,
            @Value("\${jwt.access-token-validity-in-seconds}") long validityInSeconds) {
        // 문자열 시크릿을 안전한 HMAC SHA 암호화 키 객체로 변환 (최신 스펙)
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenValidityInMilliseconds = validityInSeconds * 1000;
    }

    public String createToken(Long memberId) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + accessTokenValidityInMilliseconds);

        return Jwts.builder()
                .subject(String.valueOf(memberId))
                .issuedAt(now)
                .expiration(validity)
                .signWith(secretKey) // 서버의 비밀키로 서명
                .compact();
    }

    public Long validateTokenAndGetSubject(String token) {
        try {
            // ★ 핵심 보안 로직: 위조되거나 만료된 토큰일 경우 여기서 예외 발생
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey) // 엄격한 서명 검증
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return Long.parseLong(claims.getSubject());
            
        } catch (JwtException | IllegalArgumentException e) {
            // 검증 실패 시 전역 예외 처리기에서 401 응답 처리
            throw new BusinessException(ErrorCode.UNAUTHORIZED_USER);
        }
    }
}` 
    },
    { 
        id: 'auth', 
        title: 'Security Context Integration', 
        p: '모든 API마다 HTTP 헤더에서 토큰을 꺼내 파싱하고 유저 ID를 추출하는 코드를 중복 작성하면 컨트롤러가 오염됩니다. 또한, 개발 단계에서 편의를 위해 임시로 넣어둔 하드코딩된 ID(예: memberId = 1L)가 운영 환경에 그대로 배포되는 치명적인 휴먼 에러가 발생할 위험이 높습니다.', 
        s: 'Spring Security의 SecurityContext와 @AuthenticationPrincipal을 완벽하게 연동하여 아키텍처를 개선했습니다. Jwt 필터에서 토큰을 검증해 컨텍스트에 ID를 보관하고, 각 도메인 컨트롤러에서는 하드코딩 없이 파라미터 어노테이션 하나로 즉시 주입받아 보안성과 개발 생산성을 동시에 확보했습니다.', 
        code: `// 1. JWT 필터에서 검증 후 SecurityContext에 저장 (module-common / JwtAuthenticationFilter.java)
@Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) {
    String token = resolveToken(request);
    if (StringUtils.hasText(token)) {
        // 토큰에서 memberId 추출
        Long memberId = jwtProvider.validateTokenAndGetSubject(token);
        
        // 스프링 시큐리티 컨텍스트에 인증 객체 등록
        UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(memberId, null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
    filterChain.doFilter(request, response);
}

// =========================================================

// 2. 컨트롤러에서 안전하게 주입받아 사용 (module-core / ClaimController.java)
@RestController
@RequestMapping("/api/v1/claims")
public class ClaimController {

    // ❌ [위험한 과거 코드] 하드코딩된 ID 사용으로 인한 보안 취약점
    // Long memberId = 1L; 

    // 🟢 [개선된 코드] @AuthenticationPrincipal을 통한 안전한 주입
    @PostMapping
    public ApiResponse<List<ClaimResponse>> createClaims(
            @AuthenticationPrincipal Long memberId, // ★ 컨텍스트에서 현재 로그인한 유저 ID 자동 주입
            @Valid @RequestBody ClaimCreateRequest request
    ) {
        // 컨트롤러는 토큰 파싱이나 검증에 신경 쓸 필요 없이 비즈니스 로직 처리에만 집중
        List<ClaimResponse> responses = claimFacade.createClaims(memberId, request);
        return ApiResponse.created(responses);
    }
}` 
    },
    { 
        id: 'qdsl', 
        title: 'QueryDSL Optimization', 
        p: '상품이나 주문 검색 시 카테고리, 가격 범위, 상태 등 다양한 필터 조건이 동적으로 변합니다. 이를 Spring Data JPA의 기본 메서드(findBy...)나 @Query(JPQL) 문자열 조합으로 해결하면 코드가 지저분해지고, 컴파일 단계에서 오타(런타임 에러)를 잡을 수 없습니다.', 
        s: 'QueryDSL을 도입하여 자바 코드 기반의 타입 안전성(Type-Safe)을 확보했습니다. BooleanExpression을 활용해 검색 조건을 모듈화하고, 데이터 조회 쿼리와 Total Count 쿼리를 분리하여 페이징 성능을 최적화했습니다.', 
        code: `// 1. 동적 쿼리 및 페이징 카운트 최적화 (Custom Repository 구현)
public Page<Claim> findClaimsByCondition(ClaimSearchCond cond, Pageable pageable) {
    
    // 데이터 조회 (필요한 데이터만 Limit/Offset 적용)
    List<Claim> content = queryFactory
            .selectFrom(claim)
            .where(
                statusEq(cond.getStatus()),
                amountGoe(cond.getMinAmount())
            )
            .offset(pageable.getOffset())
            .limit(pageable.getPageSize())
            .fetch();

    // 카운트 쿼리 분리 (카운트 시 불필요한 조인 제거로 성능 향상)
    JPAQuery<Long> countQuery = queryFactory
            .select(claim.count())
            .from(claim)
            .where(
                statusEq(cond.getStatus()),
                amountGoe(cond.getMinAmount())
            );

    // PageableExecutionUtils: 조건에 따라 불필요한 카운트 쿼리 실행 생략
    return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
}

// =========================================================

// 2. 동적 검색 조건 모듈화 (재사용 및 가독성 증가)
private BooleanExpression statusEq(ClaimStatus status) {
    // 파라미터가 null이면 조건 무시(동적 처리)
    return status != null ? claim.claimStatus.eq(status) : null;
}

private BooleanExpression amountGoe(Long minAmount) {
    return minAmount != null ? claim.claimAmount.goe(minAmount) : null;
}` 
    },
    { 
        id: 'soft', 
        title: 'JPA Auditing & Tracking', 
        p: '수십 개의 데이터베이스 테이블마다 데이터가 언제 생성되었고, 언제 누구에 의해 수정되었는지(Audit 이력)를 비즈니스 로직에서 매번 수동으로 기록하는 것은 심각한 코드 중복을 낳고, 개발자의 실수로 기록이 누락될 위험이 큽니다.', 
        s: 'Spring Data JPA의 Auditing 기능을 도입하여 메타데이터 관리를 자동화했습니다. 공통 필드를 묶은 BaseEntity 클래스에 @MappedSuperclass와 @EntityListeners를 적용하여, 엔티티가 저장되거나 수정될 때 프레임워크가 시간과 작업자를 자동으로 주입하도록 설계했습니다.', 
        code: `// 1. 공통 시간 추적 엔티티 (module-common / BaseTimeEntity)
@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseTimeEntity {

    @CreatedDate
    @Column(updatable = false) // 생성 후 수정 불가
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

// =========================================================

// 2. 공통 작업자 추적 엔티티 (BaseTimeEntity 상속)
@Getter
@MappedSuperclass
public abstract class BaseEntity extends BaseTimeEntity {

    @CreatedBy
    @Column(updatable = false)
    private String createdBy; // 요청을 보낸 유저 ID 또는 시스템 자동 기록

    @LastModifiedBy
    private String modifiedBy;
}

// =========================================================

// 3. 실제 도메인 엔티티 적용
@Entity
public class Claim extends BaseEntity {
    @Id @GeneratedValue
    private Long id;
    private Long claimAmount;
    
    // createdAt, updatedAt, createdBy, modifiedBy 필드는 선언하지 않아도
    // BaseEntity를 상속받았으므로 DB 테이블에 자동 생성 및 값 주입 처리됨
}` 
    },
    { 
        id: 'sku', 
        title: 'SKU (Product Option) Modeling', 
        p: '단일 상품에 여러 옵션(색상, 사이즈 등)이 존재할 때, 옵션별로 재고와 가격이 다를 수 있습니다. 이를 단순 문자열이나 JSON 컬럼으로 묶어서 관리하면, 특정 옵션만 품절되거나 가격이 다를 때 주문 단가 계산 및 동시성 재고 차감 로직이 매우 복잡해집니다.', 
        s: 'Product와 ProductOption을 1:N 관계의 독립된 엔티티로 분리하여 완전한 SKU(Stock Keeping Unit) 단위로 모델링했습니다. 옵션별로 고유 ID, 독립적인 재고(stockQuantity), 추가 금액(additionalPrice), 판매 상태를 개별 관리하여 장바구니 및 주문 도메인에서 정확한 단가 계산과 안전한 재고 제어가 가능하도록 고도화했습니다.', 
        code: `// 1. 상품 엔티티 (module-catalog-member / Product.java)
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product extends BaseTimeEntity {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int basePrice; // 상품의 기본 가격

    // ★ 핵심: 단순 문자열 병합이 아닌, 독립된 생명주기를 가진 옵션 엔티티로 관리
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductOption> options = new ArrayList<>();

    public void addOption(ProductOption option) {
        this.options.add(option);
        option.setProduct(this);
    }
}

// =========================================================

// 2. 고도화된 SKU 옵션 엔티티 (module-catalog-member / ProductOption.java)
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductOption extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private String optionName;      // 옵션명 (예: "블랙 / XL")
    
    // ★ 옵션별 독립 속성 관리로 주문 로직의 유연성 확보
    private int additionalPrice;    // 옵션 선택 시 추가 금액 (예: +2000원)
    private int stockQuantity;      // 옵션별 개별 재고 관리
    
    @Enumerated(EnumType.STRING)
    private ProductStatus status;   // 특정 옵션만 품절(OUT_OF_STOCK) 처리 가능

    // 주문 도메인에서 호출할 최종 단가 계산 편의 메서드
    public int calculateFinalPrice() {
        return this.product.getBasePrice() + this.additionalPrice;
    }
}` 
    },
    { 
        id: 'admin', 
        title: 'Admin Activity Log', 
        p: '관리자는 주문 취소 승인, 재고 임의 변경 등 민감한 권한을 다룹니다. 이러한 작업 이력이 각 도메인(주문, 상품 등)별로 파편화되어 있으면, 추후 보안 감사나 문제 발생 시 "누가, 언제, 어떤 작업을 했는지" 일관되게 추적하기가 매우 어렵습니다.', 
        s: '지원 모듈(module-support) 내에 백오피스 전용 활동 이력(Admin Activity Log) 도메인을 독립적으로 구축하여 로깅을 중앙 집중화했습니다. 복잡한 이벤트 브로커 대신, 타 도메인에서 관리자 작업이 발생 시 Internal API(REST)로 호출하거나 프론트엔드에서 직접 API를 호출하는 직관적인 아키텍처를 채택하여 단일 DB에 모든 감사(Audit) 기록이 안전하게 적재되도록 구현했습니다.', 
        code: `// 1. 중앙 집중식 로그 기록을 담당하는 백오피스 컨트롤러 (module-support)
@RestController
@RequestMapping("/api/v1/admin/logs")
@RequiredArgsConstructor
public class AdminActivityLogController {

    private final AdminActivityLogService adminActivityLogService;

    /**
     * 타 모듈(Core 등)의 Internal API 통신 또는 프론트엔드 직접 호출을 통해
     * 관리자의 모든 주요 활동을 한 곳(Support DB)에 기록합니다.
     */
    @PostMapping
    public ApiResponse<Void> createLog(
            @AuthenticationPrincipal Long adminId, // JWT 컨텍스트를 통한 ID 주입
            @Valid @RequestBody AdminLogRequest request) {

        // 비즈니스 로직 처리 후 일관된 응답 규약 반환
        adminActivityLogService.recordActivity(adminId, request);
        return ApiResponse.ok();
    }
}

// =========================================================

// 2. 관리자 활동 이력 엔티티 (module-support / AdminActivityLog.java)
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminActivityLog extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long adminId;           // 행위자 (어떤 관리자가)

    @Enumerated(EnumType.STRING)
    private AdminRole role;         // 권한 (SUPER_ADMIN, CS_ADMIN 등)

    private String actionType;      // 수행 작업 (예: CLAIM_APPROVE, INVENTORY_UPDATE)
    private String targetId;        // 작업 대상 식별자 (클레임 ID, 상품 ID 등)
    private String description;     // 상세 사유 및 내역 (예: "환불 승인 완료")

    @Builder
    public AdminActivityLog(Long adminId, AdminRole role, String actionType, String targetId, String description) {
        this.adminId = adminId;
        this.role = role;
        this.actionType = actionType;
        this.targetId = targetId;
        this.description = description;
    }
}` 
    },
    { 
        id: 'page', 
        title: 'Standardized Pagination Response', 
        p: 'Spring Data JPA의 Page 객체를 API 응답으로 그대로 반환하면, 프론트엔드에서 불필요한 내부 데이터(pageable, sort, empty 등)까지 전달받게 됩니다. 또한 글로벌 공통 응답(ApiResponse)과 결합했을 때 JSON 구조가 파편화되어 클라이언트에서 목록 데이터를 렌더링하기 까다로워집니다.', 
        s: '공통 모듈(module-common)에 PageResponse 전용 DTO를 설계하여 페이징 규격을 표준화했습니다. Spring의 Page 객체를 생성자에서 받아 실제 데이터 목록(content)과 필수 페이징 메타데이터(pageInfo)만 추출하여 캡슐화한 뒤, 최종적으로 ApiResponse에 담아 반환함으로써 프론트엔드의 파싱 효율을 극대화했습니다.', 
        code: `// 1. 공통 페이징 응답 객체 (module-common / PageResponse.java)
@Getter
public class PageResponse<T> {
    private final List<T> content;    // 실제 데이터 목록
    private final PageInfo pageInfo;  // 페이징 메타데이터

    // Spring Data의 Page 객체를 받아 깔끔한 DTO 규격으로 자동 변환
    public PageResponse(Page<T> page) {
        this.content = page.getContent();
        this.pageInfo = new PageInfo(page);
    }

    @Getter
    public static class PageInfo {
        private final int currentPage;
        private final int pageSize;
        private final long totalElements;
        private final int totalPages;

        public PageInfo(Page<?> page) {
            // 프론트엔드 UI 처리에 직관적이도록 0-based를 1-based index로 조정
            this.currentPage = page.getNumber() + 1; 
            this.pageSize = page.getSize();
            this.totalElements = page.getTotalElements();
            this.totalPages = page.getTotalPages();
        }
    }
}

// =========================================================

// 2. 컨트롤러 적용 예시 (module-core / ClaimController.java)
@GetMapping
public ApiResponse<PageResponse<ClaimResponse>> getClaimHistory(
        @AuthenticationPrincipal Long memberId,
        @ModelAttribute ClaimSearchCondition condition,
        @PageableDefault(size = 10) Pageable pageable
) {
    // 1. 서비스 계층에서 Spring Data Page 객체 반환
    Page<ClaimResponse> claimPage = claimService.getClaimHistory(memberId, condition, pageable);
    
    // 2. PageResponse로 메타데이터를 정제한 후, ApiResponse로 최종 감싸서 반환
    return ApiResponse.ok(new PageResponse<>(claimPage));
}` 
    },
    { 
        id: 'test', 
        title: 'Event Publishing Test', 
        p: '이벤트 기반(Event-Driven) 아키텍처를 적용하면 메인 로직과 부가 로직이 분리됩니다. 이때 메인 비즈니스 로직(Service)의 단위/통합 테스트를 수행할 때, 이벤트가 정상적으로 발행되었는지 검증하려면 실제 리스너 로직까지 테스트 범위에 포함되어 결합도가 다시 높아지는 문제가 발생합니다.', 
        s: '스프링 테스트 프레임워크가 제공하는 @RecordApplicationEvents를 도입했습니다. 이를 통해 리스너의 실제 동작과 무관하게, 비즈니스 로직 실행 중 이벤트가 정확히 몇 번 발행되었고 어떤 데이터(Payload)를 담고 있는지 독립적으로 검증하는 테스트 환경을 구축했습니다.', 
        code: `// 1. 테스트 클래스 환경 설정
@SpringBootTest
@RecordApplicationEvents // ★ 테스트 중 발생하는 모든 이벤트를 메모리에 기록
class ClaimServiceTest {

    @Autowired
    private ApplicationEvents applicationEvents;

    @Test
    @DisplayName("클레임 철회 시 DB 상태가 변경되고 철회 이벤트가 발행된다")
    void withdrawClaim_Success() {
        // given
        // ... 클레임 데이터 세팅
        
        // when: 비즈니스 로직 실행 (클레임 철회)
        claimService.withdrawClaim(MEMBER_ID, claim.getId());

        // then 1: DB 상태 변경 확인 (메인 로직 검증)
        Claim withdrawnClaim = claimRepository.findById(claim.getId()).get();
        assertThat(withdrawnClaim.getClaimStatus()).isEqualTo(Claim.ClaimStatus.WITHDRAWN);

        // then 2: 트랜잭션 내에서 이벤트가 딱 1번 발행되었는지 횟수 검증
        long eventCount = applicationEvents.stream(ClaimWithdrawnEvent.class).count();
        assertThat(eventCount).isEqualTo(1); 

        // then 3: 발행된 이벤트에 올바른 식별자가 담겨 있는지 페이로드 정합성 검증
        ClaimWithdrawnEvent publishedEvent = applicationEvents.stream(ClaimWithdrawnEvent.class).findFirst().get();
        assertThat(publishedEvent.claimId()).isEqualTo(claim.getId());
    }
}` 
    }
];

function init() {
    const nav = document.getElementById('navbar');
    const main = document.getElementById('main-content');

    contentData.forEach((item, index) => {
        const navBtn = document.createElement('div');
        navBtn.className = `nav-item ${index === 0 ? 'active' : ''}`;
        navBtn.innerHTML = `${(index + 1).toString().padStart(2, '0')}. ${item.title}`;
        navBtn.onclick = (e) => showSection(item.id, e);
        nav.appendChild(navBtn);

        const sec = document.createElement('div');
        sec.id = item.id;
        sec.className = `section ${index === 0 ? 'active' : ''}`;
        sec.innerHTML = `
            <h1>${(index + 1).toString().padStart(2, '0')}. ${item.title}</h1>
            <div class="grid">
                <div class="card prob"><h3>[Problem]</h3><p>${item.p}</p></div>
                <div class="card sol"><h3>[Solution]</h3><p>${item.s}</p></div>
            </div>
            <pre><code class="language-java">${item.code}</code></pre>
        `;
        main.appendChild(sec);
    });

    if (window.Prism) {
        Prism.highlightAll();
    }
}

function showSection(id, event) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.getElementById(id).classList.add('active');
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    document.getElementById('theme-toggle').innerHTML = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
}

document.addEventListener('DOMContentLoaded', init);