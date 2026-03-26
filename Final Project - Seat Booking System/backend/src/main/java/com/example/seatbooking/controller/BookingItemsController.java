package com.example.seatbooking.controller;

import com.example.seatbooking.entity.BookingItems;
import com.example.seatbooking.entity.BookingItems.Status;
import com.example.seatbooking.service.BookingItemsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/booking-items")
public class BookingItemsController {

    private final BookingItemsService bookingItemsService;

    public BookingItemsController(BookingItemsService bookingItemsService) {
        this.bookingItemsService = bookingItemsService;
    }

    @PostMapping
    public ResponseEntity<BookingItems> createBookingItem(
            @Valid @RequestBody BookingItems bookingItems) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingItemsService.createBookingItem(bookingItems));
    }

    @GetMapping
    public ResponseEntity<List<BookingItems>> getAllBookingItems() {
        return ResponseEntity.ok(bookingItemsService.getAllBookingItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingItems> getBookingItemById(@PathVariable Long id) {
        return bookingItemsService.getBookingItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<BookingItems>> getItemsByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingItemsService.getItemsByBooking(bookingId));
    }

    @GetMapping("/seat/{seatId}")
    public ResponseEntity<List<BookingItems>> getItemsBySeat(@PathVariable Long seatId) {
        return ResponseEntity.ok(bookingItemsService.getItemsBySeat(seatId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BookingItems>> getItemsByStatus(@PathVariable Status status) {
        return ResponseEntity.ok(bookingItemsService.getItemsByStatus(status));
    }

    @GetMapping("/booking/{bookingId}/status/{status}")
    public ResponseEntity<List<BookingItems>> getItemsByBookingAndStatus(
            @PathVariable Long bookingId,
            @PathVariable Status status) {
        return ResponseEntity.ok(
                bookingItemsService.getItemsByBookingAndStatus(bookingId, status));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingItems> updateStatus(
            @PathVariable Long id,
            @RequestParam Status status) {
        return ResponseEntity.ok(bookingItemsService.updateStatus(id, status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingItems> updateBookingItem(
            @PathVariable Long id,
            @Valid @RequestBody BookingItems bookingItems) {
        return ResponseEntity.ok(bookingItemsService.updateBookingItem(id, bookingItems));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBookingItem(@PathVariable Long id) {
        bookingItemsService.deleteBookingItem(id);
        return ResponseEntity.noContent().build();
    }
}