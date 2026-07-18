package com.example.supportdesk.dto;

public class ReportCountResponse {

    private String label;
    private long count;

    public ReportCountResponse() {
    }

    public ReportCountResponse(String label, long count) {
        this.label = label;
        this.count = count;
    }

    public String getLabel() {
        return label;
    }

    public long getCount() {
        return count;
    }
}
