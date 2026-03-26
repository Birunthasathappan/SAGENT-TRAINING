package com.example.seatbooking.dto;

import com.example.seatbooking.entity.SeatLayout;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class SeatLayoutDTO {

    private Long seatId;
    private String seatNo;
    private String seatRow;
    private String seatCategory;
    private BigDecimal ticketPrice;

    // venue info — flat, no nesting
    private Long venueId;
    private String venueName;

    // ✅ Convert Entity → DTO
    public static SeatLayoutDTO from(SeatLayout s) {
        SeatLayoutDTO dto = new SeatLayoutDTO();
        dto.setSeatId(s.getSeatId());
        dto.setSeatNo(s.getSeatNo());
        dto.setSeatRow(s.getSeatRow());
        dto.setSeatCategory(s.getSeatCategory());
        dto.setTicketPrice(s.getTicketPrice());

        if (s.getVenue() != null) {
            dto.setVenueId(s.getVenue().getVenueId());
            dto.setVenueName(s.getVenue().getVenueName());
        }

        return dto;
    }
}