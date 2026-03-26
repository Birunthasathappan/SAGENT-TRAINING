package com.example.seatbooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    // ✅ EAGER + keep name, email, userId — only hide password, phoneNo
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "phoneNo", "hibernateLazyInitializer", "handler"})
    private User user;

    // ✅ EAGER + keep event title via screening → only hide circular collections
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "screening_id", nullable = false)
    @JsonIgnoreProperties({"screeningSeats", "bookings", "hibernateLazyInitializer", "handler"})
    private Screening screening;

    @Column(name = "ref_code", unique = true)
    private String refCode;

    @CreationTimestamp
    @Column(name = "booked_at", updatable = false)
    private LocalDateTime bookedAt;

    @Column(name = "total_cost", precision = 10, scale = 2)
    private BigDecimal totalCost;

    @Column(precision = 10, scale = 2)
    private BigDecimal discounts;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", nullable = false)
    private BookingStatus bookingStatus;

    public enum BookingStatus {
        CONFIRMED, PENDING, CANCELLED
    }
}