package com.example.seatbooking.repository;

import com.example.seatbooking.entity.BookingItems;
import com.example.seatbooking.entity.BookingItems.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingItemsRepository extends JpaRepository<BookingItems, Long> {

    List<BookingItems> findByBooking_BookingId(Long bookingId);
    List<BookingItems> findBySeat_SeatId(Long seatId);
    List<BookingItems> findByStatus(Status status);
    List<BookingItems> findByBooking_BookingIdAndStatus(Long bookingId, Status status);
    boolean existsByBooking_BookingIdAndSeat_SeatId(Long bookingId, Long seatId);
}