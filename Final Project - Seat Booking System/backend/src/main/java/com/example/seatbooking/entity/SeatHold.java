package com.example.seatbooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seat_holds")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SeatHold {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seat_id", nullable = false)
    @JsonIgnoreProperties({"screeningSeats", "venue"})
    private SeatLayout seat;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    // ✅ NEW: store screeningId so we can release the exact row
    @Column(name = "screening_id", nullable = false)
    private Long screeningId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HoldStatus status;

    @Column(name = "held_at", nullable = false)
    private LocalDateTime heldAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    public enum HoldStatus {
        HELD, CONFIRMED, RELEASED
    }
}