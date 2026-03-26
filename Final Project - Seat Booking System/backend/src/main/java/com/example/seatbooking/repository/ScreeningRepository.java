package com.example.seatbooking.repository;

import com.example.seatbooking.entity.Screening;
import com.example.seatbooking.entity.Screening.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScreeningRepository extends JpaRepository<Screening, Long> {

    // ✅ NEW — JOIN FETCH so event & venue always load (fixes "—" in frontend)
    @Query("SELECT s FROM Screening s JOIN FETCH s.event JOIN FETCH s.venue")
    List<Screening> findAllWithEventAndVenue();

    // ✅ NEW — single screening with event & venue fetched
    @Query("SELECT s FROM Screening s JOIN FETCH s.event JOIN FETCH s.venue WHERE s.screeningId = :id")
    Optional<Screening> findByIdWithEventAndVenue(Long id);

    // ✅ NEW — by event with JOIN FETCH
    @Query("SELECT s FROM Screening s JOIN FETCH s.event JOIN FETCH s.venue WHERE s.event.eventId = :eventId")
    List<Screening> findByEventIdWithDetails(Long eventId);

    // existing methods — unchanged
    List<Screening> findByEvent_EventId(Long eventId);
    List<Screening> findByVenue_VenueId(Long venueId);
    List<Screening> findByScreenDate(LocalDate screenDate);
    List<Screening> findByStatus(Status status);
    List<Screening> findByEvent_EventIdAndScreenDate(Long eventId, LocalDate screenDate);
}