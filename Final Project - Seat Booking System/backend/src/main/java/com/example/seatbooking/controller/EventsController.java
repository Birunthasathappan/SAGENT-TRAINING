package com.example.seatbooking.controller;

import com.example.seatbooking.dto.EventCreateDTO;
import com.example.seatbooking.dto.EventResponseDTO;
import com.example.seatbooking.entity.Events.ShowStatus;
import com.example.seatbooking.service.EventsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventsController {

    private final EventsService eventsService;

    public EventsController(EventsService eventsService) {
        this.eventsService = eventsService;
    }

    // ✅ Create event
    @PostMapping
    public ResponseEntity<EventResponseDTO> createEvent(@Valid @RequestBody EventCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(EventResponseDTO.from(eventsService.createEvent(dto)));
    }

    // ✅ Get all events
    @GetMapping
    public ResponseEntity<List<EventResponseDTO>> getAllEvents() {
        return ResponseEntity.ok(
                eventsService.getAllEvents().stream()
                        .map(EventResponseDTO::from)
                        .collect(Collectors.toList())
        );
    }

    // ✅ Get supported languages — ABOVE /{id} to avoid conflict
    @GetMapping("/languages")
    public ResponseEntity<List<String>> getSupportedLanguages() {
        return ResponseEntity.ok(
                List.of("English", "Tamil", "Hindi", "Telugu", "Malayalam", "Kannada")
        );
    }

    // ✅ Filter by category — ABOVE /{id}
    @GetMapping("/category/{category}")
    public ResponseEntity<List<EventResponseDTO>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(
                eventsService.getEventsByCategory(category).stream()
                        .map(EventResponseDTO::from)
                        .collect(Collectors.toList())
        );
    }

    // ✅ Filter by genre — ABOVE /{id}
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<EventResponseDTO>> getByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(
                eventsService.getEventsByGenre(genre).stream()
                        .map(EventResponseDTO::from)
                        .collect(Collectors.toList())
        );
    }

    // ✅ Filter by language — ABOVE /{id}
    @GetMapping("/language/{language}")
    public ResponseEntity<List<EventResponseDTO>> getByLanguage(@PathVariable String language) {
        return ResponseEntity.ok(
                eventsService.getEventsByLanguage(language).stream()
                        .map(EventResponseDTO::from)
                        .collect(Collectors.toList())
        );
    }

    // ✅ Filter by status — ABOVE /{id}
    @GetMapping("/status/{status}")
    public ResponseEntity<List<EventResponseDTO>> getByStatus(@PathVariable ShowStatus status) {
        return ResponseEntity.ok(
                eventsService.getEventsByStatus(status).stream()
                        .map(EventResponseDTO::from)
                        .collect(Collectors.toList())
        );
    }

    // ✅ Filter by organizer — ABOVE /{id}
    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<EventResponseDTO>> getByOrganizer(@PathVariable Long organizerId) {
        return ResponseEntity.ok(
                eventsService.getEventsByOrganizer(organizerId).stream()
                        .map(EventResponseDTO::from)
                        .collect(Collectors.toList())
        );
    }

    // ✅ Get event by ID — regex ensures only numbers match, not "languages" etc.
    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<EventResponseDTO> getEventById(@PathVariable Long id) {
        return eventsService.getEventById(id)
                .map(EventResponseDTO::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Update event
    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDTO> updateEvent(@PathVariable Long id,
                                                        @Valid @RequestBody EventCreateDTO dto) {
        return ResponseEntity.ok(EventResponseDTO.from(eventsService.updateEvent(id, dto)));
    }

    // ✅ Delete event
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventsService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}