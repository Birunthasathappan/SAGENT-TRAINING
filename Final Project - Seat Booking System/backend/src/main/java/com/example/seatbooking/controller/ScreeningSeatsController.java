package com.example.seatbooking.controller;

import com.example.seatbooking.dto.ScreeningSeatDTO;
import com.example.seatbooking.entity.ScreeningSeats;
import com.example.seatbooking.entity.ScreeningSeats.Availability;
import com.example.seatbooking.service.ScreeningSeatsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/screening-seats")
public class ScreeningSeatsController {

    private final ScreeningSeatsService screeningSeatsService;

    public ScreeningSeatsController(ScreeningSeatsService screeningSeatsService) {
        this.screeningSeatsService = screeningSeatsService;
    }

    @PostMapping
    public ResponseEntity<ScreeningSeatDTO> createScreeningSeat(
            @Valid @RequestBody ScreeningSeats screeningSeats) {
        ScreeningSeats created = screeningSeatsService.createScreeningSeat(screeningSeats);
        return ResponseEntity.status(HttpStatus.CREATED).body(ScreeningSeatDTO.from(created));
    }

    // ✅ FIXED: Bulk create endpoint added
    @PostMapping("/bulk")
    public ResponseEntity<List<ScreeningSeatDTO>> createBulk(
            @RequestBody List<ScreeningSeats> seatsList) {
        List<ScreeningSeats> saved = screeningSeatsService.createBulk(seatsList);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(saved.stream().map(ScreeningSeatDTO::from).collect(Collectors.toList()));
    }

    @GetMapping
    public ResponseEntity<List<ScreeningSeatDTO>> getAllScreeningSeats() {
        return ResponseEntity.ok(
                screeningSeatsService.getAllScreeningSeats()
                        .stream().map(ScreeningSeatDTO::from).collect(Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScreeningSeatDTO> getScreeningSeatById(@PathVariable Long id) {
        return screeningSeatsService.getScreeningSeatById(id)
                .map(ss -> ResponseEntity.ok(ScreeningSeatDTO.from(ss)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/screening/{screeningId}")
    public ResponseEntity<List<ScreeningSeatDTO>> getSeatsByScreening(
            @PathVariable Long screeningId) {
        return ResponseEntity.ok(
                screeningSeatsService.getSeatsByScreening(screeningId)
                        .stream().map(ScreeningSeatDTO::from).collect(Collectors.toList())
        );
    }

    @GetMapping("/screening/{screeningId}/available")
    public ResponseEntity<List<ScreeningSeatDTO>> getAvailableSeats(
            @PathVariable Long screeningId) {
        return ResponseEntity.ok(
                screeningSeatsService.getAvailableSeatsByScreening(screeningId)
                        .stream().map(ScreeningSeatDTO::from).collect(Collectors.toList())
        );
    }

    @GetMapping("/held/user/{userId}")
    public ResponseEntity<List<ScreeningSeatDTO>> getHeldSeatsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(
                screeningSeatsService.getHeldSeatsByUser(userId)
                        .stream().map(ScreeningSeatDTO::from).collect(Collectors.toList())
        );
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<ScreeningSeatDTO> updateAvailability(
            @PathVariable Long id,
            @RequestParam Availability availability) {
        return ResponseEntity.ok(
                ScreeningSeatDTO.from(screeningSeatsService.updateAvailability(id, availability))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScreeningSeatDTO> updateScreeningSeat(
            @PathVariable Long id,
            @Valid @RequestBody ScreeningSeats screeningSeats) {
        return ResponseEntity.ok(
                ScreeningSeatDTO.from(screeningSeatsService.updateScreeningSeat(id, screeningSeats))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScreeningSeat(@PathVariable Long id) {
        screeningSeatsService.deleteScreeningSeat(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/hold")
    public ResponseEntity<ScreeningSeatDTO> holdSeat(
            @PathVariable Long id,
            @RequestParam Long userId) {
        return ResponseEntity.ok(
                ScreeningSeatDTO.from(screeningSeatsService.holdSeat(id, userId))
        );
    }
}