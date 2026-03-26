package com.example.seatbooking.controller;

import com.example.seatbooking.dto.SeatLayoutDTO;
import com.example.seatbooking.entity.SeatLayout;
import com.example.seatbooking.service.SeatLayoutService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seats")
public class SeatLayoutController {

    private final SeatLayoutService seatLayoutService;

    public SeatLayoutController(SeatLayoutService seatLayoutService) {
        this.seatLayoutService = seatLayoutService;
    }

    @PostMapping
    public ResponseEntity<SeatLayoutDTO> createSeat(@Valid @RequestBody SeatLayout seatLayout) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SeatLayoutDTO.from(seatLayoutService.createSeat(seatLayout)));
    }

    @GetMapping
    public ResponseEntity<List<SeatLayoutDTO>> getAllSeats() {
        return ResponseEntity.ok(
                seatLayoutService.getAllSeats()
                        .stream().map(SeatLayoutDTO::from).collect(Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeatLayoutDTO> getSeatById(@PathVariable Long id) {
        return seatLayoutService.getSeatById(id)
                .map(s -> ResponseEntity.ok(SeatLayoutDTO.from(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<SeatLayoutDTO>> getSeatsByVenue(@PathVariable Long venueId) {
        return ResponseEntity.ok(
                seatLayoutService.getSeatsByVenue(venueId)
                        .stream().map(SeatLayoutDTO::from).collect(Collectors.toList())
        );
    }

    @GetMapping("/category/{seatCategory}")
    public ResponseEntity<List<SeatLayoutDTO>> getSeatsByCategory(@PathVariable String seatCategory) {
        return ResponseEntity.ok(
                seatLayoutService.getSeatsByCategory(seatCategory)
                        .stream().map(SeatLayoutDTO::from).collect(Collectors.toList())
        );
    }

    @GetMapping("/venue/{venueId}/category/{seatCategory}")
    public ResponseEntity<List<SeatLayoutDTO>> getSeatsByVenueAndCategory(
            @PathVariable Long venueId,
            @PathVariable String seatCategory) {
        return ResponseEntity.ok(
                seatLayoutService.getSeatsByVenueAndCategory(venueId, seatCategory)
                        .stream().map(SeatLayoutDTO::from).collect(Collectors.toList())
        );
    }

    @GetMapping("/venue/{venueId}/grouped")
    public ResponseEntity<Map<String, List<SeatLayoutDTO>>> getSeatsByCategoryGrouped(
            @PathVariable Long venueId) {
        Map<String, List<SeatLayout>> grouped = seatLayoutService.getSeatsByCategoryGrouped(venueId);
        Map<String, List<SeatLayoutDTO>> result = grouped.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue().stream()
                                .map(SeatLayoutDTO::from)
                                .collect(Collectors.toList())
                ));
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeatLayoutDTO> updateSeat(
            @PathVariable Long id,
            @Valid @RequestBody SeatLayout seatLayout) {
        return ResponseEntity.ok(SeatLayoutDTO.from(seatLayoutService.updateSeat(id, seatLayout)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeat(@PathVariable Long id) {
        seatLayoutService.deleteSeat(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/venue/{venueId}/all")
    public ResponseEntity<Void> deleteAllSeatsByVenue(@PathVariable Long venueId) {
        seatLayoutService.deleteAllSeatsByVenue(venueId);
        return ResponseEntity.noContent().build();
    }

    // ✅ NEW — Bulk create screening seats in one shot
    @PostMapping("/screening-seats/bulk")
    public ResponseEntity<Map<String, Object>> bulkCreateScreeningSeats(
            @RequestBody List<Map<String, Object>> payload) {
        int created = seatLayoutService.bulkCreateScreeningSeats(payload);
        return ResponseEntity.ok(Map.of("created", created, "status", "success"));
    }
}