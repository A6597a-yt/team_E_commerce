package com.team_e_commerce.core.claim.repository;

import com.team_e_commerce.core.claim.domain.Claim;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClaimRepository extends JpaRepository<Claim, Long>, ClaimRepositoryCustom {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Claim c where c.id = :id")
    Optional<Claim> findByIdForUpdate(@Param("id") Long id);

    @Query("SELECT c.orderLineItemId FROM Claim c WHERE c.orderLineItemId IN :itemIds AND c.claimStatus IN :statuses")
    List<Long> findPendingClaimItemIds(
            @Param("itemIds") List<Long> itemIds,
            @Param("statuses") List<Claim.ClaimStatus> statuses
    );
}