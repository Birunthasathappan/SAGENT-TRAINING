package com.example.seatbooking.service;

import com.example.seatbooking.entity.Booking;
import com.example.seatbooking.entity.Booking.BookingStatus;
import com.example.seatbooking.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    public BookingService(BookingRepository bookingRepository, EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
    }

    // ✅ createBooking — PENDING only, NO mail here
    // Mail will be sent after payment SUCCESS via updateBookingStatus()
    @Transactional
    public Booking createBooking(Booking booking) {
        booking.setRefCode("BK-" + UUID.randomUUID().toString()
                .substring(0, 8).toUpperCase());
        booking.setBookingStatus(BookingStatus.PENDING); // Stay PENDING until payment
        return bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Booking> getBookingByRefCode(String refCode) {
        return bookingRepository.findByRefCode(refCode);
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUser_UserId(userId);
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByScreening(Long screeningId) {
        return bookingRepository.findByScreening_ScreeningId(screeningId);
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByBookingStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByUserAndStatus(Long userId, BookingStatus status) {
        return bookingRepository.findByUser_UserIdAndBookingStatus(userId, status);
    }

    // ✅ FIXED: fetchBookingWithRelations — force-load all lazy fields inside transaction
    @Transactional(readOnly = true)
    public Booking fetchBookingWithRelations(Long id) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id));
        // Force-initialize all lazy relations needed for email
        b.getUser().getEmail();
        b.getUser().getName();
        b.getScreening().getScreenDate();
        b.getScreening().getStartTime();
        b.getScreening().getEvent().getTitle();
        b.getScreening().getVenue().getVenueName();
        return b;
    }

    @Transactional
    public Booking updateBookingStatus(Long id, BookingStatus status) {
        Booking existing = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id));
        existing.setBookingStatus(status);
        Booking saved = bookingRepository.save(existing);

        // ✅ Fetch with all relations before sending mail
        try {
            Booking fullBooking = fetchBookingWithRelations(saved.getBookingId());

            if (status == BookingStatus.CONFIRMED) {
                emailService.sendBookingConfirmation(fullBooking);
                System.out.println("✅ Confirmation mail sent to: "
                        + fullBooking.getUser().getEmail());
            }

            if (status == BookingStatus.CANCELLED) {
                emailService.sendCancellationMail(fullBooking, "Cancelled by user");
                System.out.println("✅ Cancellation mail sent to: "
                        + fullBooking.getUser().getEmail());
            }

        } catch (Exception e) {
            System.err.println("⚠️ Mail error (status=" + status + "): " + e.getMessage());
            e.printStackTrace(); // full stack trace for debugging
        }

        return saved;
    }

    @Transactional
    public Booking updateBooking(Long id, Booking updatedBooking) {
        Booking existing = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id));
        existing.setUser(updatedBooking.getUser());
        existing.setScreening(updatedBooking.getScreening());
        existing.setTotalCost(updatedBooking.getTotalCost());
        existing.setDiscounts(updatedBooking.getDiscounts());
        existing.setBookingStatus(updatedBooking.getBookingStatus());
        return bookingRepository.save(existing);
    }

    @Transactional
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found: " + id);
        }
        bookingRepository.deleteById(id);
    }
}