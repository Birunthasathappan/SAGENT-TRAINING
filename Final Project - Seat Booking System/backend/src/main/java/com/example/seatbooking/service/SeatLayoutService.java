package com.example.seatbooking.service;

import com.example.seatbooking.entity.BookingItems;
import com.example.seatbooking.entity.ScreeningSeats;
import com.example.seatbooking.entity.SeatLayout;
import com.example.seatbooking.repository.BookingItemsRepository;
import com.example.seatbooking.repository.ScreeningSeatsRepository;
import com.example.seatbooking.repository.ScreeningRepository;
import com.example.seatbooking.repository.SeatLayoutRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SeatLayoutService {

    private final SeatLayoutRepository seatLayoutRepository;
    private final BookingItemsRepository bookingItemsRepository;
    private final ScreeningSeatsRepository screeningSeatsRepository;
    private final ScreeningRepository screeningRepository;

    public SeatLayoutService(SeatLayoutRepository seatLayoutRepository,
                             BookingItemsRepository bookingItemsRepository,
                             ScreeningSeatsRepository screeningSeatsRepository,
                             ScreeningRepository screeningRepository) {
        this.seatLayoutRepository       = seatLayoutRepository;
        this.bookingItemsRepository     = bookingItemsRepository;
        this.screeningSeatsRepository   = screeningSeatsRepository;
        this.screeningRepository        = screeningRepository;
    }

    public SeatLayout createSeat(SeatLayout seatLayout) {
        if (seatLayoutRepository.existsBySeatNoAndVenue_VenueId(
                seatLayout.getSeatNo(),
                seatLayout.getVenue().getVenueId())) {
            throw new RuntimeException("Seat " + seatLayout.getSeatNo() + " already exists for this venue!");
        }
        return seatLayoutRepository.save(seatLayout);
    }

    public List<SeatLayout> getAllSeats() {
        return seatLayoutRepository.findAll();
    }

    public Optional<SeatLayout> getSeatById(Long id) {
        return seatLayoutRepository.findById(id);
    }

    public List<SeatLayout> getSeatsByVenue(Long venueId) {
        return seatLayoutRepository.findByVenue_VenueId(venueId);
    }

    public List<SeatLayout> getSeatsByCategory(String seatCategory) {
        return seatLayoutRepository.findBySeatCategory(seatCategory);
    }

    public List<SeatLayout> getSeatsByVenueAndCategory(Long venueId, String seatCategory) {
        return seatLayoutRepository.findByVenue_VenueIdAndSeatCategory(venueId, seatCategory);
    }

    public SeatLayout updateSeat(Long id, SeatLayout updatedSeat) {
        SeatLayout existing = seatLayoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + id));
        existing.setSeatNo(updatedSeat.getSeatNo());
        existing.setSeatRow(updatedSeat.getSeatRow());
        existing.setSeatCategory(updatedSeat.getSeatCategory());
        existing.setTicketPrice(updatedSeat.getTicketPrice());
        existing.setVenue(updatedSeat.getVenue());
        return seatLayoutRepository.save(existing);
    }

    @Transactional
    public void deleteSeat(Long id) {
        if (!seatLayoutRepository.existsById(id)) {
            throw new RuntimeException("Seat not found with id: " + id);
        }
        List<BookingItems> bookingItems = bookingItemsRepository.findBySeat_SeatId(id);
        bookingItemsRepository.deleteAll(bookingItems);
        seatLayoutRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllSeatsByVenue(Long venueId) {
        List<SeatLayout> seats = seatLayoutRepository.findByVenue_VenueId(venueId);
        for (SeatLayout seat : seats) {
            List<BookingItems> items = bookingItemsRepository.findBySeat_SeatId(seat.getSeatId());
            bookingItemsRepository.deleteAll(items);
        }
        seatLayoutRepository.deleteAll(seats);
    }

    public Map<String, List<SeatLayout>> getSeatsByCategoryGrouped(Long venueId) {
        List<SeatLayout> allSeats = seatLayoutRepository.findByVenue_VenueId(venueId);
        return allSeats.stream()
                .collect(Collectors.groupingBy(SeatLayout::getSeatCategory));
    }

    // ✅ NEW — Bulk insert all screening seats in one DB call
    @Transactional
    public int bulkCreateScreeningSeats(List<Map<String, Object>> payload) {
        List<ScreeningSeats> toSave = payload.stream().map(item -> {
            ScreeningSeats ss = new ScreeningSeats();
            Long screeningId = Long.valueOf(item.get("screeningId").toString());
            Long seatId      = Long.valueOf(item.get("seatId").toString());
            Double price     = Double.valueOf(item.get("price").toString());
            ss.setScreening(screeningRepository.getReferenceById(screeningId));
            ss.setSeat(seatLayoutRepository.getReferenceById(seatId));
            ss.setPrice(BigDecimal.valueOf(price));
            ss.setAvailability(ScreeningSeats.Availability.AVAILABLE);
            return ss;
        }).collect(Collectors.toList());

        screeningSeatsRepository.saveAll(toSave); // ✅ ONE single DB call
        return toSave.size();
    }
}