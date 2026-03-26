package com.example.seatbooking.controller;

import com.example.seatbooking.entity.Screening;
import com.example.seatbooking.entity.Screening.Status;
import com.example.seatbooking.service.ScreeningService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/screenings")
public class ScreeningController {

    private final ScreeningService screeningService;

    public ScreeningController(ScreeningService screeningService) {
        this.screeningService = screeningService;
    }

    @PostMapping
    public ResponseEntity<Screening> createScreening(@Valid @RequestBody Screening screening) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(screeningService.createScreening(screening));
    }

    @GetMapping
    public ResponseEntity<List<Screening>> getAllScreenings() {
        return ResponseEntity.ok(screeningService.getAllScreenings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Screening> getScreeningById(@PathVariable Long id) {
        return screeningService.getScreeningById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Screening>> getByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(screeningService.getScreeningsByEvent(eventId));
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<Screening>> getByVenue(@PathVariable Long venueId) {
        return ResponseEntity.ok(screeningService.getScreeningsByVenue(venueId));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Screening>> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(screeningService.getScreeningsByDate(date));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Screening>> getByStatus(@PathVariable Status status) {
        return ResponseEntity.ok(screeningService.getScreeningsByStatus(status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Screening> updateScreening(@PathVariable Long id,
                                                     @Valid @RequestBody Screening screening) {
        return ResponseEntity.ok(screeningService.updateScreening(id, screening));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScreening(@PathVariable Long id) {
        screeningService.deleteScreening(id);
        return ResponseEntity.noContent().build();
    }
}