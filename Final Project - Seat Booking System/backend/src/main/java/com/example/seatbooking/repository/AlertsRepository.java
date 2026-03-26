package com.example.seatbooking.repository;

import com.example.seatbooking.entity.Alerts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertsRepository extends JpaRepository<Alerts, Long> {

    List<Alerts> findByUser_UserId(Long userId);
    List<Alerts> findByBooking_BookingId(Long bookingId);
    List<Alerts> findByUser_UserIdAndIsRead(Long userId, Boolean isRead);
    List<Alerts> findByType(String type);
    long countByUser_UserIdAndIsRead(Long userId, Boolean isRead);
}