package com.example.seatbooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    // ✅ FIXED: LAZY → EAGER
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false)
    @JsonIgnoreProperties({"password", "screening", "bookingItems", "payments"})
    private Booking booking;

    @NotBlank
    @Column(name = "pay_mode", nullable = false)
    private String payMode;

    @CreationTimestamp
    @Column(name = "paid_at", updatable = false)
    private LocalDateTime paidAt;

    @NotNull
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(precision = 10, scale = 2)
    private BigDecimal discount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "reference_code", unique = true)
    private String referenceCode;

    public enum Status {
        SUCCESS, FAILED, PENDING, REFUNDED
    }
}