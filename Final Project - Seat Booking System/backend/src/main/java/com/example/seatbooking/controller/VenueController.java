package com.example.seatbooking.controller;

import com.example.seatbooking.entity.Venue;
import com.example.seatbooking.service.VenueService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @PostMapping
    public ResponseEntity<Venue> createVenue(@Valid @RequestBody Venue venue) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(venueService.createVenue(venue));
    }

    @GetMapping
    public ResponseEntity<List<Venue>> getAllVenues() {
        return ResponseEntity.ok(venueService.getAllVenues());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable Long id) {
        return venueService.getVenueById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<Venue>> getByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(venueService.getVenuesByDistrict(district));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venue> updateVenue(@PathVariable Long id,
                                             @Valid @RequestBody Venue venue) {
        return ResponseEntity.ok(venueService.updateVenue(id, venue));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable Long id) {
        venueService.deleteVenue(id);
        return ResponseEntity.noContent().build();
    }
}