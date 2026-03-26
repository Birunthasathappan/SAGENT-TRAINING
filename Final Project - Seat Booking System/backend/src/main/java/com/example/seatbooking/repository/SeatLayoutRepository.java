package com.example.seatbooking.repository;

import com.example.seatbooking.entity.SeatLayout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SeatLayoutRepository extends JpaRepository<SeatLayout, Long> {

    List<SeatLayout> findByVenue_VenueId(Long venueId);
    List<SeatLayout> findBySeatCategory(String seatCategory);
    List<SeatLayout> findByVenue_VenueIdAndSeatCategory(Long venueId, String seatCategory);
    boolean existsBySeatNoAndVenue_VenueId(String seatNo, Long venueId);

    // ✅ NEW: duplicate skip பண்ண இது வேணும்
    Optional<SeatLayout> findBySeatNoAndVenue_VenueId(String seatNo, Long venueId);
}