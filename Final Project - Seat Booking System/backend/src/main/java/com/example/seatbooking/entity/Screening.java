package com.example.seatbooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "screening")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Screening {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "screening_id")
    private Long screeningId;

    // ✅ FIXED: LAZY → EAGER so event always loads
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "screenings"})
    private Events event;

    // ✅ FIXED: LAZY → EAGER so venue always loads
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "venue_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "screenings"})
    private Venue venue;

    @NotNull
    @Column(name = "screen_date", nullable = false)
    private LocalDate screenDate;

    @NotNull
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @NotNull
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "remaining_seats")
    private Integer remainingSeats;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        ACTIVE, CANCELLED, COMPLETED
    }
}