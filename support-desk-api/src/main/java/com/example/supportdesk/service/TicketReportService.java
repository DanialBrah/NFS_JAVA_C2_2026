package com.example.supportdesk.service;

import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

import com.example.supportdesk.dto.ReportCountResponse;
import com.example.supportdesk.model.Ticket;

@Service
public class TicketReportService {

    private final MongoTemplate mongoTemplate;

    public TicketReportService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<ReportCountResponse> getTicketCountsByStatus() {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group("status").count().as("count"),
                Aggregation.project("count").and("_id").as("label")
        );

        AggregationResults<ReportCountResponse> results =
                mongoTemplate.aggregate(aggregation, Ticket.class, ReportCountResponse.class);

        return results.getMappedResults();
    }
}
