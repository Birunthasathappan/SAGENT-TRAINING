package com.example.seatbooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // ✅ This enables the @Scheduled in SeatHoldService
public class SeatBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(SeatBookingApplication.class, args);
    }
}