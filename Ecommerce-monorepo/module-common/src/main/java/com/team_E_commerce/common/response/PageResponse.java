package com.team_E_commerce.common.response;

import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class PageResponse<T> {

    private final List<T> content;
    private final PageInfo pageable;

    // 프론트엔드 소통규격
    public PageResponse(Page<T> page) {
        this.content = page.getContent();
        this.pageable = new PageInfo(
                page.getNumber() + 1, // ★ 핵심: 내부 0-index를 프론트엔드용 1-index로 다시 복구
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }

    @Getter
    public static class PageInfo {
        private final int pageNumber;
        private final int pageSize;
        private final long totalElements;
        private final int totalPages;
        private final boolean isFirst;
        private final boolean isLast;

        public PageInfo(int pageNumber, int pageSize, long totalElements, int totalPages, boolean isFirst, boolean isLast) {
            this.pageNumber = pageNumber;
            this.pageSize = pageSize;
            this.totalElements = totalElements;
            this.totalPages = totalPages;
            this.isFirst = isFirst;
            this.isLast = isLast;
        }
    }
}