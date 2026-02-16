package com.example.budget_tracker.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long incomeId;

    private String source;
    private Double amount;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
