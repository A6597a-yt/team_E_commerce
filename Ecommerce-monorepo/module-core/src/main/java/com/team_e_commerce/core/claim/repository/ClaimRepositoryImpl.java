package com.team_e_commerce.core.claim.repository;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.team_e_commerce.core.claim.domain.Claim;
import com.team_e_commerce.core.claim.dto.ClaimSearchCondition;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.support.PageableExecutionUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.team_e_commerce.core.claim.domain.QClaim.claim;

@RequiredArgsConstructor
public class ClaimRepositoryImpl implements ClaimRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Claim> searchClaims(Long memberId, ClaimSearchCondition condition, Pageable pageable) {

        // 데이터 조회 쿼리
        List<Claim> content = queryFactory
                .selectFrom(claim)
                .where(
                        memberIdEq(memberId, condition.memberId()),
                        claimTypeEq(condition.claimType()),
                        claimStatusEq(condition.claimStatus()),
                        orderNumberEq(condition.orderNumber()),
                        createdAtBetween(condition.getStartDateTime(), condition.getEndDateTime())
                )
                .orderBy(getOrderSpecifiers(pageable))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // 2. 카운트 쿼리 분리
        JPAQuery<Long> countQuery = queryFactory
                .select(claim.count())
                .from(claim)
                .where(
                        memberIdEq(memberId, condition.memberId()),
                        claimTypeEq(condition.claimType()),
                        claimStatusEq(condition.claimStatus()),
                        orderNumberEq(condition.orderNumber()),
                        createdAtBetween(condition.getStartDateTime(), condition.getEndDateTime())
                );

        // 첫 페이지인데 데이터가 사이즈보다 적거나, 마지막 페이지일 경우 카운트 쿼리를 DB에 날리지 않고 생략
        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }

    // null 반환 시 QueryDSL이 조건절에서 깔끔하게 무시.

    private BooleanExpression memberIdEq(Long paramMemberId, Long conditionMemberId) {
        // 고객 본인 조회(파라미터)가 우선, 없으면 어드민 검색 조건 활용
        Long targetMemberId = paramMemberId != null ? paramMemberId : conditionMemberId;
        return targetMemberId != null ? claim.memberId.eq(targetMemberId) : null;
    }

    private BooleanExpression claimTypeEq(Claim.ClaimType claimType) {
        return claimType != null ? claim.claimType.eq(claimType) : null;
    }

    private BooleanExpression claimStatusEq(Claim.ClaimStatus claimStatus) {
        return claimStatus != null ? claim.claimStatus.eq(claimStatus) : null;
    }

    private BooleanExpression orderNumberEq(String orderNumber) {
        return orderNumber != null && !orderNumber.isBlank() ? claim.orderNumber.eq(orderNumber) : null;
    }

    private BooleanExpression createdAtBetween(LocalDateTime start, LocalDateTime end) {
        if (start != null && end != null) {
            return claim.createdAt.between(start, end);
        } else if (start != null) {
            return claim.createdAt.goe(start); // 크거나 같다 (>=)
        } else if (end != null) {
            return claim.createdAt.loe(end);   // 작거나 같다 (<=)
        }
        return null;
    }

    // 클라이언트가 보낸 Sort 조건을 QueryDSL 객체로 변환.

    private OrderSpecifier<?>[] getOrderSpecifiers(Pageable pageable) {
        List<OrderSpecifier<?>> specifiers = new ArrayList<>();

        if (!pageable.getSort().isEmpty()) {
            for (Sort.Order order : pageable.getSort()) {
                Order direction = order.getDirection().isAscending() ? Order.ASC : Order.DESC;

                // PathBuilder를 활용해 클라이언트가 던진 문자열(예: "claimAmount")을 엔티티 필드로 동적 매핑
                PathBuilder<Claim> pathBuilder = new PathBuilder<>(Claim.class, "claim");
                specifiers.add(new OrderSpecifier(direction, pathBuilder.get(order.getProperty())));
            }
        } else {
            // 정렬 조건이 없을 때의 기본값: 최신순(PK 내림차순)
            specifiers.add(claim.id.desc());
        }

        return specifiers.toArray(new OrderSpecifier[0]);
    }
}