package com.team_e_commerce.core.claim.repository;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.team_e_commerce.core.claim.dto.ClaimSearchCondition;
import com.team_e_commerce.core.claim.entity.Claim;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Q클래스는 부모인 QClaim 하나만 import
import static com.team_e_commerce.core.claim.entity.QClaim.claim;

@Repository
@RequiredArgsConstructor
public class ClaimRepositoryImpl implements ClaimRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    // 1. 관리자(Admin) 전체 클레임 조회
    @Override
    public Page<Claim> searchClaims(ClaimSearchCondition condition, Pageable pageable) {
        List<Claim> content = queryFactory
                .selectFrom(claim)
                // 헬퍼 메서드를 통해 조건절 조립 (파라미터 memberId는 null로 전달)
                .where(buildSearchConditions(null, condition))
                .orderBy(getOrderSpecifiers(pageable))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(claim.count())
                .from(claim)
                .where(buildSearchConditions(null, condition));

        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }

    // 2. 고객 본인 클레임 조회
    @Override
    public Page<Claim> searchClaims(Long memberId, ClaimSearchCondition condition, Pageable pageable) {
        List<Claim> content = queryFactory
                .selectFrom(claim)
                .where(buildSearchConditions(memberId, condition))
                .orderBy(getOrderSpecifiers(pageable))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(claim.count())
                .from(claim)
                .where(buildSearchConditions(memberId, condition));

        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }

    // 공통 검색 조건 조립 헬퍼
    // 조건이 누락되거나 관리자/고객 쿼리 간에 파편화되는 것을 방지.
    private BooleanExpression[] buildSearchConditions(Long memberId, ClaimSearchCondition condition) {
        return new BooleanExpression[]{
                memberIdEq(memberId, condition.memberId()),
                claimTypeEq(condition.claimType()),
                claimStatusEq(condition.claimStatus()),
                orderNumberEq(condition.orderNumber()),
                createdAtBetween(condition.getStartDateTime(), condition.getEndDateTime())
        };
    }

    // 개별 검색 조건 메서드
    private BooleanExpression claimTypeEq(Claim.ClaimType claimType) {
        return claimType != null ? claim.claimType.eq(claimType) : null;
    }

    private BooleanExpression claimStatusEq(Claim.ClaimStatus claimStatus) {
        return claimStatus != null ? claim.claimStatus.eq(claimStatus) : null;
    }

    private BooleanExpression memberIdEq(Long paramMemberId, Long conditionMemberId) {
        Long targetMemberId = paramMemberId != null ? paramMemberId : conditionMemberId;
        return targetMemberId != null ? claim.memberId.eq(targetMemberId) : null;
    }

    private BooleanExpression orderNumberEq(String orderNumber) {
        return orderNumber != null && !orderNumber.isBlank() ? claim.orderNumber.eq(orderNumber) : null;
    }

    private BooleanExpression createdAtBetween(LocalDateTime start, LocalDateTime end) {
        if (start != null && end != null) {
            return claim.createdAt.between(start, end);
        } else if (start != null) {
            return claim.createdAt.goe(start);
        } else if (end != null) {
            return claim.createdAt.loe(end);
        }
        return null;
    }

    // 정렬 조건
    private OrderSpecifier<?>[] getOrderSpecifiers(Pageable pageable) {
        List<OrderSpecifier<?>> specifiers = new ArrayList<>();

        // MANUAL_CHECK_REQUIRED 상태를 최상단에 고정
        NumberExpression<Integer> statusPriority = new CaseBuilder()
                .when(claim.claimStatus.eq(Claim.ClaimStatus.MANUAL_CHECK_REQUIRED)).then(0)
                .otherwise(1);
        specifiers.add(statusPriority.asc());

        // 클라이언트가 요청한 페이징 정렬 조건 적용
        if (!pageable.getSort().isEmpty()) {
            for (Sort.Order order : pageable.getSort()) {
                Order direction = order.getDirection().isAscending() ? Order.ASC : Order.DESC;
                PathBuilder<Claim> pathBuilder = new PathBuilder<>(Claim.class, "claim");
                specifiers.add(new OrderSpecifier(direction, pathBuilder.get(order.getProperty())));
            }
        } else {
            // 정렬 조건이 없을 때의 기본값
            specifiers.add(claim.id.desc());
        }

        return specifiers.toArray(new OrderSpecifier[0]);
    }
}