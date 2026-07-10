package com.example.assettracker.service;

import com.example.assettracker.dto.CreateTicketRequest;
import com.example.assettracker.dto.TicketResponse;
import com.example.assettracker.exception.ResourceNotFoundException;
import com.example.assettracker.model.Ticket;
import com.example.assettracker.repository.TicketRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    // Return all tickets from MongoDB, mapped to response DTOs.
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Find a ticket by id or throw a ResourceNotFoundException which is
    // handled globally by GlobalExceptionHandler.
    public TicketResponse getTicketById(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket " + id + " was not found"));

        return toResponse(ticket);
    }

    // Create a new ticket from the request DTO, applying backend defaults,
    // save it into MongoDB, and return the response DTO.
    public TicketResponse createTicket(CreateTicketRequest request) {
        Ticket ticket = new Ticket(
                request.getTitle().trim(),
                request.getDescription().trim(),
                request.getCategory().trim(),
                request.getPriority().trim(),
                "OPEN",
                request.getCreatedBy().trim(),
                LocalDateTime.now()
        );

        Ticket savedTicket = ticketRepository.save(ticket);
        return toResponse(savedTicket);
    }

    // Helper to convert a Ticket to a TicketResponse DTO.
    private TicketResponse toResponse(Ticket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getCreatedBy(),
                ticket.getCreatedAt()
        );
    }
}
