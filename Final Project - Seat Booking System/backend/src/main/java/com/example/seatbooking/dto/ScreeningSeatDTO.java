package com.example.seatbooking.dto;

import com.example.seatbooking.entity.ScreeningSeats;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ScreeningSeatDTO {

    private Long screeningSeatsId;
    private BigDecimal price;
    private String availability;

    // seat info only — no nested venue/screening
    private Long seatId;
    private String seatNo;
    private String seatRow;
    private String seatCategory;

    // screening id only
    private Long screeningId;

    // ✅ Convert Entity → DTO
    public static ScreeningSeatDTO from(ScreeningSeats ss) {
        ScreeningSeatDTO dto = new ScreeningSeatDTO();
        dto.setScreeningSeatsId(ss.getScreeningSeatsId());
        dto.setPrice(ss.getPrice());
        dto.setAvailability(ss.getAvailability() != null ? ss.getAvailability().name() : null);

        if (ss.getSeat() != null) {
            dto.setSeatId(ss.getSeat().getSeatId());
            dto.setSeatNo(ss.getSeat().getSeatNo());
            dto.setSeatRow(ss.getSeat().getSeatRow());
            dto.setSeatCategory(ss.getSeat().getSeatCategory());
        }

        if (ss.getScreening() != null) {
            dto.setScreeningId(ss.getScreening().getScreeningId());
        }

        return dto;
    }
}