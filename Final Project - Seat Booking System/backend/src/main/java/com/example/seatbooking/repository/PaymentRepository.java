package com.example.seatbooking.repository;

import com.example.seatbooking.entity.Payment;
import com.example.seatbooking.entity.Payment.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByBooking_BookingId(Long bookingId);
    List<Payment> findByStatus(Status status);
    Optional<Payment> findByReferenceCode(String referenceCode);
    List<Payment> findByPayMode(String payMode);
    boolean existsByReferenceCode(String referenceCode);
    List<Payment> findByBooking_User_UserId(Long userId);
}