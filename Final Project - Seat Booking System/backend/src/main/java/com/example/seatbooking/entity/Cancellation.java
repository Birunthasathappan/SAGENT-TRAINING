package com.example.seatbooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cancellation")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Cancellation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cancellation_id")
    private Long cancellationId;

    // ✅ EAGER + only hide sensitive/circular fields, keep name, email, userId
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false)
    @JsonIgnoreProperties({"screening", "bookingItems", "payments", "hibernateLazyInitializer", "handler"})
    private Booking booking;

    // ✅ EAGER + keep name, email, userId — only hide password, phoneNo
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "phoneNo", "hibernateLazyInitializer", "handler"})
    private User user;

    @NotBlank
    @Column(nullable = false)
    private String reason;

    @Column(precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @CreationTimestamp
    @Column(name = "cancelled_at", updatable = false)
    private LocalDateTime cancelledAt;

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}