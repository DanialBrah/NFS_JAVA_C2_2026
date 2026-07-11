package com.example.supportdesk.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.supportdesk.dto.CreateTicketRequest;
import com.example.supportdesk.dto.TicketResponse;
import com.example.supportdesk.exception.ResourceNotFoundException;
import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.repository.TicketRepository;

@Service
public class TicketService {

    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public List<TicketResponse> getTickets(String status, String priority, String category) {
        logger.info("Fetching tickets with filters - status={}, priority={}, category={}", status, priority, category);

        List<Ticket> tickets;

        if (hasValue(status)) {
            tickets = ticketRepository.findByStatusIgnoreCase(status.trim());
        } else if (hasValue(priority)) {
            tickets = ticketRepository.findByPriorityIgnoreCase(priority.trim());
        } else if (hasValue(category)) {
            tickets = ticketRepository.findByCategoryIgnoreCase(category.trim());
        } else {
            tickets = ticketRepository.findAll();
        }

        return tickets.stream()
                .map(this::toResponse)
                .toList();
    }

    public Page<TicketResponse> getTicketsPaged(int page, int size, String sortBy, String direction) {
        logger.info("Fetching paginated tickets - page={}, size={}, sortBy={}, direction={}", page, size, sortBy, direction);

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return ticketRepository.findAll(pageable)
                .map(this::toResponse);
    }

    public TicketResponse getTicketById(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket " + id + " was not found"));

        return toResponse(ticket);
    }

    public TicketResponse createTicket(CreateTicketRequest request) {
        Ticket ticket = new Ticket(
                request.getTitle().trim(),
                request.getDescription().trim(),
                request.getCategory().trim(),
                request.getPriority().trim(),
                "OPEN",
                request.getCreatedBy().trim(),
                LocalDate.now(ZoneId.systemDefault()).toString()
        );

        Ticket saved = ticketRepository.save(ticket);
        logger.info("Created ticket with id={}", saved.getId());

        return toResponse(saved);
    }

    private boolean hasValue(String value) {
        return value != null && !value.trim().isBlank();
    }

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
