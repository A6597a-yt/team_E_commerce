package com.team_E_commerce.core.order.domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.HashMap;
import java.util.Map;

@Converter
public class OrderOptionConverter implements AttributeConverter<Map<String, String>, String> {

    // 스프링 빈 주입 에러를 방지하기 위해 Converter 내부에서 직접 생성
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, String> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return "{}"; // null 방어
        }
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("옵션 데이터를 JSON으로 변환하는 데 실패했습니다.", e);
        }
    }

    @Override
    public Map<String, String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return new HashMap<>();
        }
        try {
            return objectMapper.readValue(dbData, new TypeReference<Map<String, String>>() {});
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("JSON 데이터를 옵션 Map으로 역직렬화하는 데 실패했습니다.", e);
        }
    }
}