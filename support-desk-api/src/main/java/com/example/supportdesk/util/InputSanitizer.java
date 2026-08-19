package com.example.supportdesk.util;

public final class InputSanitizer {

    private InputSanitizer() {
    }

    public static String trimToNull(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    public static String stripControlCharacters(String value) {
        if (value == null) {
            return null;
        }

        return value.replaceAll("[\\p{Cntrl}&&[^\\t\\n\\r]]", "");
    }

    public static String cleanText(String value) {
        String stripped = stripControlCharacters(value);
        if (stripped == null) {
            return null;
        }

        String collapsed = stripped.replaceAll("\\s+", " ").trim();
        return collapsed.isEmpty() ? null : collapsed;
    }

    public static String cleanMultilineText(String value) {
        return trimToNull(stripControlCharacters(value));
    }

    public static String normalizeCode(String value) {
        String cleaned = cleanText(value);
        return cleaned == null ? null : cleaned.toUpperCase();
    }
}
