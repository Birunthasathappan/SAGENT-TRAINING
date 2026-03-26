package com.example.seatbooking.dto;

import com.example.seatbooking.entity.Events;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class EventResponseDTO {

    private Long eventId;
    private String title;
    private String category;
    private String genre;
    private String description;
    private Integer duration;
    private String language;
    private String tag;
    private String showStatus;
    private String image;
    private Long organizerId;
    private String organizerName;

    public static EventResponseDTO from(Events e) {
        return EventResponseDTO.builder()
                .eventId(e.getEventId())
                .title(e.getTitle())
                .category(e.getCategory())
                .genre(e.getGenre())
                .description(e.getDescription())
                .duration(e.getDuration())
                .language(e.getLanguage())
                .tag(e.getTag())
                .showStatus(e.getShowStatus() != null ? e.getShowStatus().name() : null)
                .image(e.getImage())
                .organizerId(e.getOrganizer() != null ? e.getOrganizer().getUserId() : null)
                .organizerName(e.getOrganizer() != null ? e.getOrganizer().getName() : null)
                .build();
    }
}