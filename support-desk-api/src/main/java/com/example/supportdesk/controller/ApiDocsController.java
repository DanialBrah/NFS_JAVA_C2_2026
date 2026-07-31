package com.example.supportdesk.controller;

import com.example.supportdesk.dto.ApiDocsResponse;
import com.example.supportdesk.dto.EndpointInfo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/docs")
public class ApiDocsController {

    @GetMapping
    public ApiDocsResponse getApiDocs() {
        List<EndpointInfo> endpoints = List.of(
                new EndpointInfo("POST", "/api/auth/register", "Public", "Register a new user."),
                new EndpointInfo("POST", "/api/auth/login", "Public", "Log in and receive a JWT."),
                new EndpointInfo("GET", "/api/health", "Public", "Health check."),
                new EndpointInfo("GET", "/api/about", "Public", "About info."),
                new EndpointInfo("GET", "/api/docs", "Public", "This API documentation."),
                new EndpointInfo("GET", "/api/v1/tickets", "USER or ADMIN", "List support tickets."),
                new EndpointInfo("GET", "/api/v1/tickets/{id}", "USER or ADMIN", "Get a single ticket by id."),
                new EndpointInfo("POST", "/api/v1/tickets", "USER or ADMIN", "Create a new ticket."),
                new EndpointInfo("PUT", "/api/v1/tickets/{id}", "USER or ADMIN", "Update an existing ticket."),
                new EndpointInfo("GET", "/api/v1/reports/tickets-by-status", "Authenticated", "Ticket counts grouped by status."),
                new EndpointInfo("GET", "/api/v1/reports/tickets-by-priority", "Authenticated", "Ticket counts grouped by priority."),
                new EndpointInfo("GET", "/api/tickets", "USER or ADMIN", "List support tickets (legacy, unversioned)."),
                new EndpointInfo("POST", "/api/tickets", "ADMIN", "Create a new ticket (legacy, unversioned).")
        );

        return new ApiDocsResponse("Support Desk Ticket API", "v1", "/api/v1", endpoints);
    }
}
