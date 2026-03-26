package com.example.seatbooking.service;

import com.example.seatbooking.entity.SeatHold;
import com.example.seatbooking.entity.ScreeningSeats;
import com.example.seatbooking.repository.SeatHoldRepository;
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
public class SeatHoldService {

    private static final Logger log = LoggerFactory.getLogger(SeatHoldService.class);

    private final SeatHoldRepository seatHoldRepository;
    private final ScreeningSeatsRepository screeningSeatsRepository;

    public SeatHoldService(SeatHoldRepository seatHoldRepository,
                           ScreeningSeatsRepository screeningSeatsRepository) {
        this.seatHoldRepository = seatHoldRepository;
        this.screeningSeatsRepository = screeningSeatsRepository;
    }

    // ✅ Runs every 30 seconds - releases expired holds
    @Scheduled(fixedRate = 30000)
    @Transactional
    public void releaseExpiredHolds() {
        List<SeatHold> expiredHolds = seatHoldRepository.findExpiredHolds(LocalDateTime.now());

        if (expiredHolds.isEmpty()) return;

        log.info("Releasing {} expired seat holds...", expiredHolds.size());

        for (SeatHold hold : expiredHolds) {
            releaseSingleHold(hold);
        }
    }

    // ✅ Release all HELD holds for a user for a specific screening
    @Transactional
    public void releaseHoldsForUser(Long userId, Long screeningId) {
        List<SeatHold> userHolds = seatHoldRepository
                .findByUserIdAndScreeningIdAndStatus(userId, screeningId, SeatHold.HoldStatus.HELD);

        if (userHolds.isEmpty()) {
            log.warn("No HELD seats found for userId: {} screeningId: {}", userId, screeningId);
            return;
        }

        for (SeatHold hold : userHolds) {
            releaseSingleHold(hold);
        }

        log.info("Released all holds for userId: {} screeningId: {}", userId, screeningId);
    }

    // ✅ Confirm all HELD holds for a user for a specific screening
    @Transactional
    public void confirmHoldsForUser(Long userId, Long screeningId) {
        List<SeatHold> userHolds = seatHoldRepository
                .findByUserIdAndScreeningIdAndStatus(userId, screeningId, SeatHold.HoldStatus.HELD);

        if (userHolds.isEmpty()) {
            log.warn("No HELD seats to confirm for userId: {} screeningId: {}", userId, screeningId);
            return;
        }

        userHolds.forEach(hold -> hold.setStatus(SeatHold.HoldStatus.CONFIRMED));
        seatHoldRepository.saveAll(userHolds);

        log.info("Confirmed {} holds for userId: {} screeningId: {}", userHolds.size(), userId, screeningId);
    }

    // ✅ Release a single hold and mark the seat as AVAILABLE
    private void releaseSingleHold(SeatHold hold) {
        hold.setStatus(SeatHold.HoldStatus.RELEASED);
        seatHoldRepository.save(hold);

        Optional<ScreeningSeats> screeningSeatOpt = screeningSeatsRepository
                .findBySeat_SeatIdAndScreening_ScreeningIdAndAvailability(
                        hold.getSeat().getSeatId(),
                        hold.getScreeningId(),
                        ScreeningSeats.Availability.HELD
                );

        screeningSeatOpt.ifPresentOrElse(ss -> {
            ss.setAvailability(ScreeningSeats.Availability.AVAILABLE);
            screeningSeatsRepository.save(ss);
            log.info("Seat released → AVAILABLE: seatId={}, screeningId={}",
                    hold.getSeat().getSeatId(), hold.getScreeningId());
        }, () -> {
            log.warn("ScreeningSeat not found or not HELD: seatId={}, screeningId={}",
                    hold.getSeat().getSeatId(), hold.getScreeningId());
        });
    }
}