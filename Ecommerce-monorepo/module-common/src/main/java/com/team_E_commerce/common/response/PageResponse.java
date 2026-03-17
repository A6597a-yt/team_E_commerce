package com.team_E_commerce.common.response;

import org.springframework.data.domain.Page;
import java.util.List;

public record PageResponse<T>(
        List<T> content,
        PageInfo pageInfo
) {
    // 프론트엔드 소통 규격
    public PageResponse(Page<T> page) {
        this(
                page.getContent(),
                new PageInfo(
                        page.getNumber() + 1, // ★ 유지: 0-index -> 1-index 프론트엔드 규격 복구
                        page.getSize(),
                        page.getTotalElements(),
                        page.getTotalPages(),
                        page.isFirst(),
                        page.isLast()
                )
        );
    }

    public record PageInfo(
            int pageNumber,
            int pageSize,
            long totalElements,
            int totalPages,
            boolean isFirst,
            boolean isLast
    ) {}
}