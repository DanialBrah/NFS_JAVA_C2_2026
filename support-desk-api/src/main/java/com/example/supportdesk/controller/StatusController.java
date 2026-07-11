package com.example.supportdesk.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController // Tells Spring this class is a Controller, handles HTTP requests
public class StatusController {

    @GetMapping("/api/health") // maps a GET request to a Java method
    public Map<String, String> health() {
        return Map.of(
            "status", "UP",
            "service", "support-desk-api"
        );
    }

    @GetMapping("/api/about")
    public Map<String, String> about() {
        return Map.of(
            "appName", "Support Desk API",
            "version", "1.0.0",
            "description", "API for managing IT support tickets"
        );
    }
}
