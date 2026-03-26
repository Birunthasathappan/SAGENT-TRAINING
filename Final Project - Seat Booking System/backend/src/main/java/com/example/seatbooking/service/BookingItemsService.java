package com.example.seatbooking.service;

import com.example.seatbooking.entity.BookingItems;
import com.example.seatbooking.entity.BookingItems.Status;
import com.example.seatbooking.repository.BookingItemsRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BookingItemsService {

    private final BookingItemsRepository bookingItemsRepository;

    public BookingItemsService(BookingItemsRepository bookingItemsRepository) {
        this.bookingItemsRepository = bookingItemsRepository;
    }

    public BookingItems createBookingItem(BookingItems bookingItems) {
        if (bookingItemsRepository.existsByBooking_BookingIdAndSeat_SeatId(
                bookingItems.getBooking().getBookingId(),
                bookingItems.getSeat().getSeatId())) {
            throw new RuntimeException("Seat already added to this booking!");
        }
        return bookingItemsRepository.save(bookingItems);
    }

    public List<BookingItems> getAllBookingItems() {
        return bookingItemsRepository.findAll();
    }

    public Optional<BookingItems> getBookingItemById(Long id) {
        return bookingItemsRepository.findById(id);
    }

    public List<BookingItems> getItemsByBooking(Long bookingId) {
        return bookingItemsRepository.findByBooking_BookingId(bookingId);
    }

    public List<BookingItems> getItemsBySeat(Long seatId) {
        return bookingItemsRepository.findBySeat_SeatId(seatId);
    }

    public List<BookingItems> getItemsByStatus(Status status) {
        return bookingItemsRepository.findByStatus(status);
    }

    public List<BookingItems> getItemsByBookingAndStatus(Long bookingId, Status status) {
        return bookingItemsRepository.findByBooking_BookingIdAndStatus(bookingId, status);
    }

    public BookingItems updateStatus(Long id, Status status) {
        BookingItems existing = bookingItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BookingItem not found with id: " + id));
        existing.setStatus(status);
        return bookingItemsRepository.save(existing);
    }

    public BookingItems updateBookingItem(Long id, BookingItems updatedItem) {
        BookingItems existing = bookingItemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BookingItem not found with id: " + id));
        existing.setBooking(updatedItem.getBooking());
        existing.setSeat(updatedItem.getSeat());
        existing.setPrice(updatedItem.getPrice());
        existing.setStatus(updatedItem.getStatus());
        return bookingItemsRepository.save(existing);
    }

    public void deleteBookingItem(Long id) {
        if (!bookingItemsRepository.existsById(id)) {
            throw new RuntimeException("BookingItem not found with id: " + id);
        }
        bookingItemsRepository.deleteById(id);
    }
}