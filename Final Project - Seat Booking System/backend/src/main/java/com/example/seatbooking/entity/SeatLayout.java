package com.example.seatbooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "seats_layout")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SeatLayout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Long seatId;

    // ✅ FIXED: LAZY → EAGER
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "venue_id", nullable = false)
    @JsonIgnoreProperties({"screenings", "seats"})
    private Venue venue;

    @NotBlank
    @Column(name = "seat_no", nullable = false)
    private String seatNo;

    @NotBlank
    @Column(name = "seat_row", nullable = false)
    private String seatRow;

    @NotBlank
    @Column(name = "seat_category", nullable = false)
    private String seatCategory;

    @NotNull
    @Column(name = "ticket_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal ticketPrice;

    // ✅ Ignore screeningSeats in JSON to avoid circular reference
    @JsonIgnoreProperties({"seat", "screening"})
    @OneToMany(mappedBy = "seat", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ScreeningSeats> screeningSeats;
}