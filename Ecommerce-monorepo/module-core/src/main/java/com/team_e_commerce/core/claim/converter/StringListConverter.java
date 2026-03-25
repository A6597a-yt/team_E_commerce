package com.team_e_commerce.core.claim.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

@Converter // autoApply = true 없이 수동 명시 방식 유지
public class StringListConverter implements AttributeConverter<List<String>, String> {

    // 💡 생성 비용이 높은 ObjectMapper를 static final로 선언하여 메모리 최적화 및 재사용
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return "[]";
        }
        try {
            return MAPPER.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("이미지 리스트를 JSON으로 변환하는 데 실패했습니다.", e);
        }
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return MAPPER.readValue(dbData, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("JSON을 이미지 리스트로 변환하는 데 실패했습니다.", e);
        }
    }
}