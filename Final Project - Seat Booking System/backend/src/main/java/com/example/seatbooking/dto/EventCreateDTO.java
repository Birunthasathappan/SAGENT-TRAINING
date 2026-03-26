package com.example.seatbooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class EventCreateDTO {

    @NotNull(message = "Organizer ID is required")
    private Long organizerId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Genre is required")
    private String genre;

    private String description;

    @NotNull(message = "Duration is required")
    private Integer duration;

    @NotBlank(message = "Language is required")
    private String language;

    private String tag;

    @NotNull(message = "Show status is required")
    private String showStatus;

    // Base64 or image URL — optional
    private String image;
}