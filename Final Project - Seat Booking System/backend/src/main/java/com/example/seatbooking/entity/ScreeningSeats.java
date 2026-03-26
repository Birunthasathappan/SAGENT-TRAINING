package com.example.seatbooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "screening_seats")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ScreeningSeats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "screening_seats_id")
    private Long screeningSeatsId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "screening_id", nullable = false)
    @JsonIgnoreProperties({"screeningSeats", "bookings", "venue", "event"})
    private Screening screening;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seat_id", nullable = false)
    @JsonIgnoreProperties({"screeningSeats", "venue"})
    private SeatLayout seat;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Availability availability;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hold_by")
    @JsonIgnoreProperties({"password", "createdAt", "phoneNo"})
    private User holdBy;

    @Column(name = "hold_till")
    private LocalDateTime holdTill;

    // ✅ NO manual setAvailability — Lombok handles it!

    public enum Availability {
        AVAILABLE, HELD, BOOKED
    }
}