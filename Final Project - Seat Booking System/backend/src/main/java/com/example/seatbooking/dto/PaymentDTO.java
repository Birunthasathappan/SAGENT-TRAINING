package com.example.seatbooking.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentDTO {
    private Long paymentId;
    private String payMode;
    private BigDecimal amount;
    private BigDecimal discount;
    private String status;
    private String referenceCode;
    private LocalDateTime paidAt;
    // Booking fields flattened — no nested objects
    private Long bookingId;
    private String bookingRefCode;
    private String bookingStatus;
    private Long userId;
    private String userName;
    private String userEmail;
}