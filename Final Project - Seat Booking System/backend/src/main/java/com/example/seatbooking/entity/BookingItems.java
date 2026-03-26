package com.example.seatbooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "booking_items")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class BookingItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_items_id")
    private Long bookingItemsId;

    // ✅ FIXED: LAZY → EAGER
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false)
    @JsonIgnoreProperties({"password", "screening", "bookingItems"})
    private Booking booking;

    // ✅ FIXED: LAZY → EAGER
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seat_id", nullable = false)
    @JsonIgnoreProperties({"screeningSeats", "venue"})
    private SeatLayout seat;

    @NotNull
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        ACTIVE, CANCELLED
    }
}