package com.example.seatbooking.controller;

import com.example.seatbooking.entity.SeatHold;
import com.example.seatbooking.repository.SeatHoldRepository;
import com.example.seatbooking.service.SeatHoldService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/seat-holds")
@CrossOrigin(origins = "*")
public class SeatHoldController {

    private final SeatHoldRepository seatHoldRepository;
    private final SeatHoldService seatHoldService;

    public SeatHoldController(SeatHoldRepository seatHoldRepository,
                              SeatHoldService seatHoldService) {
        this.seatHoldRepository = seatHoldRepository;
        this.seatHoldService = seatHoldService;
    }

    // ✅ GET all holds
    @GetMapping
    public ResponseEntity<List<SeatHold>> getAllHolds() {
        return ResponseEntity.ok(seatHoldRepository.findAll());
    }

    // ✅ GET holds by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SeatHold>> getHoldsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(seatHoldRepository.findByUserId(userId));
    }

    // ✅ GET hold by id
    @GetMapping("/{id}")
    public ResponseEntity<SeatHold> getHoldById(@PathVariable Long id) {
        return seatHoldRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ POST create a new hold
    @PostMapping
    public ResponseEntity<SeatHold> createHold(@RequestBody SeatHold seatHold) {
        seatHold.setStatus(SeatHold.HoldStatus.HELD);
        seatHold.setHeldAt(LocalDateTime.now());
        seatHold.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        SeatHold saved = seatHoldRepository.save(seatHold);
        return ResponseEntity.ok(saved);
    }

    // ✅ PATCH release hold manually
    @PatchMapping("/{id}/release")
    public ResponseEntity<SeatHold> releaseHold(@PathVariable Long id) {
        return seatHoldRepository.findById(id).map(hold -> {
            hold.setStatus(SeatHold.HoldStatus.RELEASED);
            return ResponseEntity.ok(seatHoldRepository.save(hold));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ PATCH confirm hold after booking
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<SeatHold> confirmHold(@PathVariable Long id) {
        return seatHoldRepository.findById(id).map(hold -> {
            hold.setStatus(SeatHold.HoldStatus.CONFIRMED);
            return ResponseEntity.ok(seatHoldRepository.save(hold));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ FIXED — now requires screeningId too
    @PatchMapping("/user/{userId}/screening/{screeningId}/release")
    public ResponseEntity<String> releaseUserHolds(
            @PathVariable Long userId,
            @PathVariable Long screeningId) {
        seatHoldService.releaseHoldsForUser(userId, screeningId);
        return ResponseEntity.ok("All holds released for user: " + userId
                + ", screening: " + screeningId);
    }

    // ✅ FIXED — now requires screeningId too
    @PatchMapping("/user/{userId}/screening/{screeningId}/confirm")
    public ResponseEntity<String> confirmUserHolds(
            @PathVariable Long userId,
            @PathVariable Long screeningId) {
        seatHoldService.confirmHoldsForUser(userId, screeningId);
        return ResponseEntity.ok("All holds confirmed for user: " + userId
                + ", screening: " + screeningId);
    }

    // ✅ POST manually trigger expired hold release (for testing)
    @PostMapping("/release-expired")
    public ResponseEntity<String> releaseExpired() {
        seatHoldService.releaseExpiredHolds();
        return ResponseEntity.ok("Expired holds released successfully!");
    }

    // ✅ DELETE hold by id
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHold(@PathVariable Long id) {
        if (!seatHoldRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        seatHoldRepository.deleteById(id);
        return ResponseEntity.ok("Hold deleted successfully!");
    }
}