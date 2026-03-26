package com.example.seatbooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "events")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Events {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;

    // ✅ CHANGED: LAZY → EAGER so organizer is always loaded (fixes "could not initialize proxy" error)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organizer_id", nullable = false)
    @JsonIgnoreProperties({"password", "createdAt", "role", "phoneNo", "email"})
    private User organizer;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String genre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(nullable = false)
    private Integer duration;

    @Column(nullable = false)
    private String language;

    private String tag;

    @Enumerated(EnumType.STRING)
    @Column(name = "show_status", nullable = false)
    private ShowStatus showStatus;

    // Stores Base64 image string or image URL
    @Column(name = "image", columnDefinition = "LONGTEXT")
    private String image;

    public enum ShowStatus {
        UPCOMING, ONGOING, COMPLETED, CANCELLED
    }
}