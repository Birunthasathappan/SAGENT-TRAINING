package com.example.seatbooking.service;

import com.example.seatbooking.entity.ScreeningSeats;
import com.example.seatbooking.entity.ScreeningSeats.Availability;
import com.example.seatbooking.entity.User;
import com.example.seatbooking.repository.ScreeningSeatsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ScreeningSeatsService {

    private static final Logger log = LoggerFactory.getLogger(ScreeningSeatsService.class);

    private final ScreeningSeatsRepository screeningSeatsRepository;

    public ScreeningSeatsService(ScreeningSeatsRepository screeningSeatsRepository) {
        this.screeningSeatsRepository = screeningSeatsRepository;
    }

    public ScreeningSeats createScreeningSeat(ScreeningSeats screeningSeats) {
        if (screeningSeatsRepository.existsByScreening_ScreeningIdAndSeat_SeatId(
                screeningSeats.getScreening().getScreeningId(),
                screeningSeats.getSeat().getSeatId())) {
            throw new RuntimeException("Seat already exists for this screening!");
        }
        return screeningSeatsRepository.save(screeningSeats);
    }

    // ✅ FIXED: Bulk create method added
    @Transactional
    public List<ScreeningSeats> createBulk(List<ScreeningSeats> seatsList) {
        return screeningSeatsRepository.saveAll(seatsList);
    }

    public List<ScreeningSeats> getAllScreeningSeats() {
        return screeningSeatsRepository.findAll();
    }

    public Optional<ScreeningSeats> getScreeningSeatById(Long id) {
        return screeningSeatsRepository.findById(id);
    }

    public List<ScreeningSeats> getSeatsByScreening(Long screeningId) {
        return screeningSeatsRepository.findByScreening_ScreeningId(screeningId);
    }

    public List<ScreeningSeats> getAvailableSeatsByScreening(Long screeningId) {
        return screeningSeatsRepository
                .findByScreening_ScreeningIdAndAvailability(screeningId, Availability.AVAILABLE);
    }

    public List<ScreeningSeats> getHeldSeatsByUser(Long userId) {
        return screeningSeatsRepository.findByHoldBy_UserId(userId);
    }

    public ScreeningSeats updateAvailability(Long id, Availability availability) {
        ScreeningSeats existing = screeningSeatsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ScreeningSeat not found with id: " + id));
        existing.setAvailability(availability);
        return screeningSeatsRepository.save(existing);
    }

    public ScreeningSeats updateScreeningSeat(Long id, ScreeningSeats updatedSeat) {
        ScreeningSeats existing = screeningSeatsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ScreeningSeat not found with id: " + id));
        existing.setScreening(updatedSeat.getScreening());
        existing.setSeat(updatedSeat.getSeat());
        existing.setPrice(updatedSeat.getPrice());
        existing.setAvailability(updatedSeat.getAvailability());
        existing.setHoldBy(updatedSeat.getHoldBy());
        existing.setHoldTill(updatedSeat.getHoldTill());
        return screeningSeatsRepository.save(existing);
    }

    public void deleteScreeningSeat(Long id) {
        if (!screeningSeatsRepository.existsById(id)) {
            throw new RuntimeException("ScreeningSeat not found with id: " + id);
        }
        screeningSeatsRepository.deleteById(id);
    }

    @Transactional
    public ScreeningSeats holdSeat(Long screeningSeatId, Long userId) {
        ScreeningSeats seat = screeningSeatsRepository.findById(screeningSeatId)
                .orElseThrow(() -> new RuntimeException("Seat not found: " + screeningSeatId));

        if (seat.getAvailability() == Availability.HELD ||
                seat.getAvailability() == Availability.BOOKED) {
            throw new RuntimeException("Seat is not available!");
        }

        User user = new User();
        user.setUserId(userId);

        seat.setAvailability(Availability.HELD);
        seat.setHoldBy(user);
        seat.setHoldTill(LocalDateTime.now().plusMinutes(10));

        log.info("Seat {} held by user {} until {}", screeningSeatId, userId, seat.getHoldTill());
        return screeningSeatsRepository.save(seat);
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void releaseExpiredHolds() {
        List<ScreeningSeats> expired = screeningSeatsRepository
                .findExpiredHolds(LocalDateTime.now());

        if (expired.isEmpty()) {
            log.debug("Scheduler: No expired holds.");
            return;
        }

        log.info("Scheduler: Releasing {} expired hold(s)...", expired.size());
        for (ScreeningSeats seat : expired) {
            seat.setAvailability(Availability.AVAILABLE);
            seat.setHoldBy(null);
            seat.setHoldTill(null);
            screeningSeatsRepository.save(seat);
            log.info("Scheduler: Released seat id {}", seat.getScreeningSeatsId());
        }
    }
}