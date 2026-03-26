package com.example.seatbooking.dto;

import com.example.seatbooking.entity.Cancellation;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CancellationDTO {

    private Long cancellationId;
    private Long bookingId;
    private String refCode;
    private Long userId;
    private String userName;
    private String userEmail;
    private String eventTitle;   // ✅ NEW
    private String reason;
    private BigDecimal amount;
    private String status;
    private LocalDateTime cancelledAt;

    public static CancellationDTO from(Cancellation c) {
        CancellationDTO dto = new CancellationDTO();
        dto.cancellationId = c.getCancellationId();
        dto.reason         = c.getReason();
        dto.amount         = c.getAmount();
        dto.status         = c.getStatus() != null ? c.getStatus().name() : null;
        dto.cancelledAt    = c.getCancelledAt();

        // ✅ Null safe booking
        try {
            if (c.getBooking() != null) {
                dto.bookingId = c.getBooking().getBookingId();
                dto.refCode   = c.getBooking().getRefCode();

                // ✅ Event title via booking → screening → event
                if (c.getBooking().getScreening() != null &&
                        c.getBooking().getScreening().getEvent() != null) {
                    dto.eventTitle = c.getBooking().getScreening().getEvent().getTitle();
                }
            }
        } catch (Exception e) { /* lazy load failed — skip */ }

        // ✅ Null safe user
        try {
            if (c.getUser() != null) {
                dto.userId    = c.getUser().getUserId();
                dto.userName  = c.getUser().getName();
                dto.userEmail = c.getUser().getEmail();
            }
        } catch (Exception e) { /* lazy load failed — skip */ }

        return dto;
    }

    public Long getCancellationId()       { return cancellationId; }
    public Long getBookingId()            { return bookingId; }
    public String getRefCode()            { return refCode; }
    public Long getUserId()               { return userId; }
    public String getUserName()           { return userName; }
    public String getUserEmail()          { return userEmail; }
    public String getEventTitle()         { return eventTitle; }
    public String getReason()             { return reason; }
    public BigDecimal getAmount()         { return amount; }
    public String getStatus()             { return status; }
    public LocalDateTime getCancelledAt() { return cancelledAt; }
}