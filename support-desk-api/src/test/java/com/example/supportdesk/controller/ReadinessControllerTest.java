package com.example.supportdesk.controller;

import com.example.supportdesk.repository.TicketRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ReadinessControllerTest {

    private final TicketRepository ticketRepository = mock(TicketRepository.class);
    private final ReadinessController controller = new ReadinessController(ticketRepository);

    @Test
    void returnsReadyWhenDatabaseIsUp() {
        when(ticketRepository.count()).thenReturn(5L);

        ResponseEntity<Map<String, Object>> response = controller.readiness();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
                .containsEntry("service", "support-desk-api")
                .containsEntry("status", "READY")
                .containsEntry("database", "CONNECTED");
    }

    @Test
    void returnsServiceUnavailableWhenDatabaseIsDown() {
        when(ticketRepository.count()).thenThrow(new RuntimeException("Mongo connection refused"));

        ResponseEntity<Map<String, Object>> response = controller.readiness();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
        assertThat(response.getBody())
                .containsEntry("service", "support-desk-api")
                .containsEntry("status", "NOT_READY")
                .containsEntry("database", "DISCONNECTED")
                .containsEntry("message", "Database readiness check failed");
    }
}
