package com.example.seatbooking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "venue")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "venue_id")
    private Long venueId;

    @NotBlank
    @Column(name = "venue_name", nullable = false)
    private String venueName;

    @NotBlank
    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String region;

    @NotNull
    @Column(nullable = false)
    private Integer capacity;
}