package com.example.assettracker.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.assettracker.model.Ticket;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    // Custom query methods can be defined here if needed

}
