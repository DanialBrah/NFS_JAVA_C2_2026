package com.example.supportdesk.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import com.example.supportdesk.dto.CreateTicketRequest;
import com.example.supportdesk.dto.TicketResponse;
import com.example.supportdesk.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class TicketService {
    private final List<TicketResponse> tickets = new ArrayList<>();

    public TicketService() {
        tickets.add(new TicketResponse(
            "T001",
            "Cannot access email",
            "User cannot login to company email account.",
            "Email",
            "HIGH",
            "OPEN",
            "amir@example.com",
            "2026-07-03"
        ));

        tickets.add(new TicketResponse(
            "T002",
            "Laptop is slow",
            "Laptop takes a long time to boot up and open applications.",
            "Hardware",
            "MEDIUM",
            "OPEN",
            "siti@example.com",
            "2026-07-03"
        ));

        tickets.add(new TicketResponse(
            "T003",
            "VPN connection not working",
            "User is unable to connect to the company VPN from home.",
            "Network",
            "HIGH",
            "IN_PROGRESS",
            "farid@example.com",
            "2026-07-04"
        ));
    }

    public List<TicketResponse> getAllTickets() {
        return tickets;
    }

    public TicketResponse getTicketById(String id) {
        return tickets.stream()
                .filter(ticket -> ticket.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Ticket " + id + " was not found"));
    }

    public TicketResponse createTicket(CreateTicketRequest request) {
        TicketResponse created = new TicketResponse(
                createNextId(),
                request.getTitle().trim(),
                request.getDescription().trim(),
                request.getCategory().trim(),
                request.getPriority().trim(),
                "OPEN",
                request.getCreatedBy().trim(),
                LocalDate.now(ZoneId.systemDefault()).toString()
        );

        tickets.add(created);
        return created;
    }

    private String createNextId() {
        return "T" + String.format("%03d", tickets.size() + 1);
    }
}
