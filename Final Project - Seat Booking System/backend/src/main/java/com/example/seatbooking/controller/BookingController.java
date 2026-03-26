package com.example.seatbooking.controller;

import com.example.seatbooking.entity.Booking;
import com.example.seatbooking.entity.Booking.BookingStatus;
import com.example.seatbooking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody Booking booking) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(booking));
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ref/{refCode}")
    public ResponseEntity<Booking> getBookingByRefCode(@PathVariable String refCode) {
        return bookingService.getBookingByRefCode(refCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }

    @GetMapping("/screening/{screeningId}")
    public ResponseEntity<List<Booking>> getBookingsByScreening(@PathVariable Long screeningId) {
        return ResponseEntity.ok(bookingService.getBookingsByScreening(screeningId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable BookingStatus status) {
        return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByUserAndStatus(
            @PathVariable Long userId,
            @PathVariable BookingStatus status) {
        return ResponseEntity.ok(bookingService.getBookingsByUserAndStatus(userId, status));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.updateBooking(id, booking));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}