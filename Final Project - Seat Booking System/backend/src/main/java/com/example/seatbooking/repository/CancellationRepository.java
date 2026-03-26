package com.example.seatbooking.repository;

import com.example.seatbooking.entity.Cancellation;
import com.example.seatbooking.entity.Cancellation.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CancellationRepository extends JpaRepository<Cancellation, Long> {

    boolean existsByBooking_BookingId(Long bookingId);

    List<Cancellation> findByUser_UserId(Long userId);

    List<Cancellation> findByBooking_BookingId(Long bookingId);

    List<Cancellation> findByStatus(Status status);

    List<Cancellation> findByUser_UserIdAndStatus(Long userId, Status status);

    // ✅ NEW — duplicate check with status
    Optional<Cancellation> findByBooking_BookingIdAndStatus(Long bookingId, Status status);

    // ✅ NEW — full fetch with all relations (lazy load fix)
    @Query("SELECT c FROM Cancellation c " +
            "LEFT JOIN FETCH c.booking b " +
            "LEFT JOIN FETCH b.user " +
            "LEFT JOIN FETCH b.screening s " +
            "LEFT JOIN FETCH s.event " +
            "LEFT JOIN FETCH s.venue " +
            "LEFT JOIN FETCH c.user " +
            "WHERE c.cancellationId = :id")
    Optional<Cancellation> findByIdWithDetails(@Param("id") Long id);
}