package com.example.supportdesk.dto;

import java.util.List;

public class ApiDocsResponse {

    private String application;
    private String version;
    private String baseUrl;
    private List<EndpointInfo> endpoints;

    public ApiDocsResponse(String application, String version, String baseUrl, List<EndpointInfo> endpoints) {
        this.application = application;
        this.version = version;
        this.baseUrl = baseUrl;
        this.endpoints = endpoints;
    }

    public String getApplication() {
        return application;
    }

    public String getVersion() {
        return version;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public List<EndpointInfo> getEndpoints() {
        return endpoints;
    }
}
