package com.example.seatbooking.repository;

import com.example.seatbooking.entity.ScreeningSeats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScreeningSeatsRepository extends JpaRepository<ScreeningSeats, Long> {

    boolean existsByScreening_ScreeningIdAndSeat_SeatId(Long screeningId, Long seatId);

    List<ScreeningSeats> findByScreening_ScreeningId(Long screeningId);

    List<ScreeningSeats> findByScreening_ScreeningIdAndAvailability(Long screeningId, ScreeningSeats.Availability availability);

    List<ScreeningSeats> findByHoldBy_UserId(Long userId);

    Optional<ScreeningSeats> findBySeat_SeatIdAndScreening_ScreeningIdAndAvailability(
            Long seatId,
            Long screeningId,
            ScreeningSeats.Availability availability
    );

    @Query("SELECT ss FROM ScreeningSeats ss WHERE ss.holdTill < :now AND ss.availability = 'HELD' AND ss.holdBy IS NOT NULL")
    List<ScreeningSeats> findExpiredHolds(@Param("now") LocalDateTime now);
}