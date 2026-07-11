package com.example.supportdesk.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.supportdesk.model.Ticket;

public interface TicketRepository extends MongoRepository<Ticket, String> {

    List<Ticket> findByStatusIgnoreCase(String status);

    List<Ticket> findByPriorityIgnoreCase(String priority);

    List<Ticket> findByCategoryIgnoreCase(String category);
}
