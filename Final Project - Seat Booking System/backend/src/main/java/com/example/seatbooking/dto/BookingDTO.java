package com.example.seatbooking.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingDTO {
    private Long bookingId;
    private String refCode;
    private LocalDateTime bookedAt;
    private BigDecimal totalCost;
    private BigDecimal discounts;
    private String bookingStatus;
    // User flattened
    private Long userId;
    private String userName;
    private String userEmail;
    // Screening flattened
    private Long screeningId;
    private String eventTitle;
    private String venueName;
    private String screenDate;
    private String startTime;
}