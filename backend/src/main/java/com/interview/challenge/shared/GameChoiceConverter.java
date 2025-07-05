package com.interview.challenge.shared;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

// Assuming you have an enum like:
// public enum GameChoice { ROCK, PAPER, SCISSORS; }

@Converter(autoApply = true) // Automatically apply this converter to all GameChoice enums
public class GameChoiceConverter implements AttributeConverter<List<String>, String> {

    private static final String DELIMITER = ","; // Or any other suitable delimiter

    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return null;
        }
        return String.join(DELIMITER, attribute);
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return new ArrayList<>(List.of(dbData.split(DELIMITER)));
    }
}