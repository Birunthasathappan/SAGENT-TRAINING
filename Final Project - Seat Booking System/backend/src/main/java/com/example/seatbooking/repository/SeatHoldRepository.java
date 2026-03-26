package com.example.seatbooking.repository;

import com.example.seatbooking.entity.SeatHold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SeatHoldRepository extends JpaRepository<SeatHold, Long> {

    // ✅ Find expired holds
    @Query("SELECT s FROM SeatHold s WHERE s.status = 'HELD' AND s.expiresAt < :now")
    List<SeatHold> findExpiredHolds(@Param("now") LocalDateTime now);

    // ✅ Find hold by seat id and status
    Optional<SeatHold> findBySeat_SeatIdAndStatus(Long seatId, SeatHold.HoldStatus status);

    // ✅ Find all holds by user
    List<SeatHold> findByUserId(Long userId);

    // ✅ Find all holds by seat id
    List<SeatHold> findBySeat_SeatId(Long seatId);

    // ✅ Find holds by user and status (all screenings)
    List<SeatHold> findByUserIdAndStatus(Long userId, SeatHold.HoldStatus status);

    // ✅ NEW — Find holds by user + screening + status (screening-specific)
    List<SeatHold> findByUserIdAndScreeningIdAndStatus(
            Long userId,
            Long screeningId,
            SeatHold.HoldStatus status
    );
}