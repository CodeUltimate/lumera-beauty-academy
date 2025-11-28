package com.lumera.academy.repository;

import com.lumera.academy.dto.LiveClassFilter;
import com.lumera.academy.entity.LiveClass;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class LiveClassSpecification {

    public static Specification<LiveClass> withFilters(UUID educatorId, LiveClassFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always filter by educator
            predicates.add(cb.equal(root.get("educator").get("id"), educatorId));

            // Status filter
            if (filter.getStatus() != null && !filter.getStatus().equalsIgnoreCase("all")) {
                List<LiveClass.ClassStatus> statuses = switch (filter.getStatus().toLowerCase()) {
                    case "upcoming" -> List.of(LiveClass.ClassStatus.SCHEDULED, LiveClass.ClassStatus.LIVE);
                    case "past" -> List.of(LiveClass.ClassStatus.COMPLETED);
                    case "draft" -> List.of(LiveClass.ClassStatus.DRAFT);
                    case "cancelled" -> List.of(LiveClass.ClassStatus.CANCELLED);
                    default -> List.of(LiveClass.ClassStatus.values());
                };
                predicates.add(root.get("status").in(statuses));
            }

            // Category filter
            if (filter.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), filter.getCategoryId()));
            }

            // Skill level filter
            if (filter.getSkillLevel() != null) {
                predicates.add(cb.equal(root.get("skillLevel"), filter.getSkillLevel()));
            }

            // Date range filter (on scheduledAt)
            if (filter.getStartDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("scheduledAt"), filter.getStartDate()));
            }
            if (filter.getEndDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("scheduledAt"), filter.getEndDate()));
            }

            // Search filter (title)
            if (filter.getSearch() != null && !filter.getSearch().isBlank()) {
                String searchPattern = "%" + filter.getSearch().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("title")), searchPattern));
            }

            // Fetch educator and category eagerly to avoid N+1
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("educator", JoinType.LEFT);
                root.fetch("category", JoinType.LEFT);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
