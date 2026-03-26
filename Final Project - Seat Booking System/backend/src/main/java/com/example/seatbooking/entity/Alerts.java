package com.example.seatbooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "alerts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Alerts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alert_id")
    private Long alertId;

    // ✅ FIXED: LAZY → EAGER
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "phoneNo", "createdAt"})
    private User user;

    // ✅ FIXED: LAZY → EAGER
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id")
    @JsonIgnoreProperties({"user", "screening", "bookingItems", "payments"})
    private Booking booking;

    @NotBlank
    @Column(nullable = false)
    private String message;

    @NotBlank
    @Column(nullable = false)
    private String type;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;
}