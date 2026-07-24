package com.example.supportdesk.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class ApiInfoController {

    @GetMapping("/info")
    public Map<String, Object> getApiInfo() {
        return Map.of(
            "application", "Support Desk API",
            "version", "v1",
            "status", "active",
            "documentation", "/api/docs",
            "reports", "/api/v1/reports/tickets-by-status",
            "description", "API for tracking support tickets"
        );
    }
}
