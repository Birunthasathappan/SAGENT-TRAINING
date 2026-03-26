package com.example.seatbooking.repository;

import com.example.seatbooking.entity.Booking;
import com.example.seatbooking.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser_UserId(Long userId);
    List<Booking> findByScreening_ScreeningId(Long screeningId);
    List<Booking> findByBookingStatus(BookingStatus bookingStatus);
    Optional<Booking> findByRefCode(String refCode);
    boolean existsByRefCode(String refCode);
    List<Booking> findByUser_UserIdAndBookingStatus(Long userId, BookingStatus bookingStatus);
}