package com.example.seatbooking.service;

import com.example.seatbooking.entity.Screening;
import com.example.seatbooking.entity.Screening.Status;
import com.example.seatbooking.entity.ScreeningSeats;
import com.example.seatbooking.repository.ScreeningRepository;
import com.example.seatbooking.repository.ScreeningSeatsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ScreeningService {

    private final ScreeningRepository screeningRepository;
    private final ScreeningSeatsRepository screeningSeatsRepository; // ✅ ADD THIS

    public ScreeningService(ScreeningRepository screeningRepository,
                            ScreeningSeatsRepository screeningSeatsRepository) { // ✅ ADD THIS
        this.screeningRepository = screeningRepository;
        this.screeningSeatsRepository = screeningSeatsRepository; // ✅ ADD THIS
    }

    public Screening createScreening(Screening screening) {
        return screeningRepository.save(screening);
    }

    public List<Screening> getAllScreenings() {
        return screeningRepository.findAllWithEventAndVenue();
    }

    public Optional<Screening> getScreeningById(Long id) {
        return screeningRepository.findByIdWithEventAndVenue(id);
    }

    public List<Screening> getScreeningsByEvent(Long eventId) {
        return screeningRepository.findByEventIdWithDetails(eventId);
    }

    public List<Screening> getScreeningsByVenue(Long venueId) {
        return screeningRepository.findByVenue_VenueId(venueId);
    }

    public List<Screening> getScreeningsByDate(LocalDate date) {
        return screeningRepository.findByScreenDate(date);
    }

    public List<Screening> getScreeningsByStatus(Status status) {
        return screeningRepository.findByStatus(status);
    }

    public Screening updateScreening(Long id, Screening updatedScreening) {
        Screening existing = screeningRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Screening not found with id: " + id));
        existing.setEvent(updatedScreening.getEvent());
        existing.setVenue(updatedScreening.getVenue());
        existing.setScreenDate(updatedScreening.getScreenDate());
        existing.setStartTime(updatedScreening.getStartTime());
        existing.setEndTime(updatedScreening.getEndTime());
        existing.setRemainingSeats(updatedScreening.getRemainingSeats());
        existing.setStatus(updatedScreening.getStatus());
        return screeningRepository.save(existing);
    }

    // ✅ FIXED — delete screening_seats first, then screening
    @Transactional
    public void deleteScreening(Long id) {
        if (!screeningRepository.existsById(id)) {
            throw new RuntimeException("Screening not found with id: " + id);
        }

        // ✅ Step 1: Delete all screening seats for this screening
        List<ScreeningSeats> seats = screeningSeatsRepository
                .findByScreening_ScreeningId(id);
        screeningSeatsRepository.deleteAll(seats);

        // ✅ Step 2: Now safe to delete screening
        screeningRepository.deleteById(id);
    }
}