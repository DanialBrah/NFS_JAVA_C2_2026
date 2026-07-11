package com.example.supportdesk.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.repository.TicketRepository;

@Configuration
public class TicketDataSeeder {

    @Bean
    CommandLineRunner seedTickets(TicketRepository ticketRepository) {
        return args -> {
            if (ticketRepository.count() > 0) {
                return;
            }

            ticketRepository.save(new Ticket(
                    "Cannot access email",
                    "User cannot login to company email account.",
                    "Email",
                    "HIGH",
                    "OPEN",
                    "amir@example.com",
                    "2026-07-03"
            ));

            ticketRepository.save(new Ticket(
                    "Laptop is slow",
                    "Laptop takes a long time to boot up and open applications.",
                    "Hardware",
                    "MEDIUM",
                    "OPEN",
                    "siti@example.com",
                    "2026-07-03"
            ));

            ticketRepository.save(new Ticket(
                    "VPN connection not working",
                    "User is unable to connect to the company VPN from home.",
                    "Network",
                    "HIGH",
                    "IN_PROGRESS",
                    "farid@example.com",
                    "2026-07-04"
            ));
        };
    }
}
