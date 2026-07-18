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

    private static final String COUNT_FIELD = "count";
    private static final String LABEL_FIELD = "label";

    public List<ReportCountResponse> getTicketCountsByStatus() {
        return countGroupedBy("status");
    }

    public List<ReportCountResponse> countTicketsByPriority() {
        return countGroupedBy("priority");
    }

    private List<ReportCountResponse> countGroupedBy(String field) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group(field).count().as(COUNT_FIELD),
                Aggregation.project(COUNT_FIELD).and("_id").as(LABEL_FIELD)
        );

        AggregationResults<ReportCountResponse> results =
                mongoTemplate.aggregate(aggregation, Ticket.class, ReportCountResponse.class);

        return results.getMappedResults();
    }
}
