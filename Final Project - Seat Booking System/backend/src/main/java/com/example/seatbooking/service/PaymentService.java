package com.example.seatbooking.service;

import com.example.seatbooking.entity.Booking.BookingStatus;
import com.example.seatbooking.entity.Payment;
import com.example.seatbooking.entity.Payment.Status;
import com.example.seatbooking.repository.BookingRepository;
import com.example.seatbooking.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    public PaymentService(PaymentRepository paymentRepository,
                          BookingRepository bookingRepository,
                          BookingService bookingService) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.bookingService    = bookingService;
    }

    public Payment createPayment(Payment payment) {
        payment.setReferenceCode("PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setStatus(Status.PENDING);
        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public Optional<Payment> getPaymentByReferenceCode(String referenceCode) {
        return paymentRepository.findByReferenceCode(referenceCode);
    }

    public List<Payment> getPaymentsByBooking(Long bookingId) {
        return paymentRepository.findByBooking_BookingId(bookingId);
    }

    public List<Payment> getPaymentsByStatus(Status status) {
        return paymentRepository.findByStatus(status);
    }

    public List<Payment> getPaymentsByPayMode(String payMode) {
        return paymentRepository.findByPayMode(payMode);
    }

    public List<Payment> getPaymentsByUser(Long userId) {
        return paymentRepository.findByBooking_User_UserId(userId);
    }

    // ✅ Payment SUCCESS → Booking CONFIRMED → Mail trigger!
    @Transactional
    public Payment updatePaymentStatus(Long id, Status status) {
        Payment existing = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        existing.setStatus(status);
        Payment saved = paymentRepository.save(existing);

        // ✅ SUCCESS → booking CONFIRMED → mail poguthu!
        if (status == Status.SUCCESS) {
            Long bookingId = saved.getBooking().getBookingId();
            bookingService.updateBookingStatus(bookingId, BookingStatus.CONFIRMED);
        }

        return saved;
    }

    public Payment updatePayment(Long id, Payment updatedPayment) {
        Payment existing = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        existing.setBooking(updatedPayment.getBooking());
        existing.setPayMode(updatedPayment.getPayMode());
        existing.setAmount(updatedPayment.getAmount());
        existing.setDiscount(updatedPayment.getDiscount());
        existing.setStatus(updatedPayment.getStatus());
        return paymentRepository.save(existing);
    }

    public void deletePayment(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new RuntimeException("Payment not found with id: " + id);
        }
        paymentRepository.deleteById(id);
    }
}
