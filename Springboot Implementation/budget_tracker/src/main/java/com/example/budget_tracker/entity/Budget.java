package com.example.budget_tracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long budgetId;

    private String category;
    private Double limitAmount;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
