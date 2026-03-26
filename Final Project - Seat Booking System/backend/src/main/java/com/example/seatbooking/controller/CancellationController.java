package com.example.seatbooking.controller;

import com.example.seatbooking.dto.CancellationDTO;
import com.example.seatbooking.entity.Cancellation;
import com.example.seatbooking.entity.Cancellation.Status;
import com.example.seatbooking.service.CancellationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cancellations")
public class CancellationController {

    private final CancellationService cancellationService;

    public CancellationController(CancellationService cancellationService) {
        this.cancellationService = cancellationService;
    }

    // ✅ Simple Map return — no circular JSON!
    @PostMapping
    public ResponseEntity<Map<String, Object>> createCancellation(
            @Valid @RequestBody Cancellation cancellation) {
        Cancellation saved = cancellationService.createCancellation(cancellation);

        Map<String, Object> response = new HashMap<>();
        response.put("cancellationId", saved.getCancellationId());
        response.put("status", saved.getStatus());
        response.put("reason", saved.getReason());
        response.put("amount", saved.getAmount());
        response.put("cancelledAt", saved.getCancelledAt());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<CancellationDTO>> getAllCancellations() {
        return ResponseEntity.ok(
                cancellationService.getAllCancellations()
                        .stream().map(CancellationDTO::from).collect(Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CancellationDTO> getCancellationById(@PathVariable Long id) {
        return cancellationService.getCancellationById(id)
                .map(c -> ResponseEntity.ok(CancellationDTO.from(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CancellationDTO>> getCancellationsByUser(
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                cancellationService.getCancellationsByUser(userId)
                        .stream().map(CancellationDTO::from).collect(Collectors.toList())
        );
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<CancellationDTO>> getCancellationsByBooking(
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(
                cancellationService.getCancellationsByBooking(bookingId)
                        .stream().map(CancellationDTO::from).collect(Collectors.toList())
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CancellationDTO>> getCancellationsByStatus(
            @PathVariable Status status) {
        return ResponseEntity.ok(
                cancellationService.getCancellationsByStatus(status)
                        .stream().map(CancellationDTO::from).collect(Collectors.toList())
        );
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<CancellationDTO>> getCancellationsByUserAndStatus(
            @PathVariable Long userId,
            @PathVariable Status status) {
        return ResponseEntity.ok(
                cancellationService.getCancellationsByUserAndStatus(userId, status)
                        .stream().map(CancellationDTO::from).collect(Collectors.toList())
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CancellationDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam Status status) {
        return ResponseEntity.ok(
                CancellationDTO.from(cancellationService.updateStatus(id, status))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CancellationDTO> updateCancellation(
            @PathVariable Long id,
            @Valid @RequestBody Cancellation cancellation) {
        return ResponseEntity.ok(
                CancellationDTO.from(
                        cancellationService.updateCancellation(id, cancellation))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCancellation(@PathVariable Long id) {
        cancellationService.deleteCancellation(id);
        return ResponseEntity.noContent().build();
    }
}