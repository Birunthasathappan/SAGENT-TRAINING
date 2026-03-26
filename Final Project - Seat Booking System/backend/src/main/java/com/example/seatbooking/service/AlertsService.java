package com.example.seatbooking.service;

import com.example.seatbooking.entity.Alerts;
import com.example.seatbooking.repository.AlertsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class AlertsService {

    private final AlertsRepository alertsRepository;

    public AlertsService(AlertsRepository alertsRepository) {
        this.alertsRepository = alertsRepository;
    }

    @Transactional
    public Alerts createAlert(Alerts alert) {
        alert.setIsRead(false);
        return alertsRepository.save(alert);
    }

    @Transactional(readOnly = true)
    public List<Alerts> getAllAlerts() {
        return alertsRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Alerts> getAlertById(Long id) {
        return alertsRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Alerts> getAlertsByUser(Long userId) {
        return alertsRepository.findByUser_UserId(userId);
    }

    @Transactional(readOnly = true)
    public List<Alerts> getAlertsByBooking(Long bookingId) {
        return alertsRepository.findByBooking_BookingId(bookingId);
    }

    @Transactional(readOnly = true)
    public List<Alerts> getUnreadAlertsByUser(Long userId) {
        return alertsRepository.findByUser_UserIdAndIsRead(userId, false);
    }

    @Transactional(readOnly = true)
    public List<Alerts> getReadAlertsByUser(Long userId) {
        return alertsRepository.findByUser_UserIdAndIsRead(userId, true);
    }

    @Transactional(readOnly = true)
    public List<Alerts> getAlertsByType(String type) {
        return alertsRepository.findByType(type);
    }

    @Transactional(readOnly = true)
    public long countUnreadAlerts(Long userId) {
        return alertsRepository.countByUser_UserIdAndIsRead(userId, false);
    }

    @Transactional
    public Alerts markAsRead(Long id) {
        Alerts existing = alertsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + id));
        existing.setIsRead(true);
        return alertsRepository.save(existing);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Alerts> unreadAlerts = alertsRepository.findByUser_UserIdAndIsRead(userId, false);
        unreadAlerts.forEach(alert -> alert.setIsRead(true));
        alertsRepository.saveAll(unreadAlerts);
    }

    @Transactional
    public void deleteAlert(Long id) {
        if (!alertsRepository.existsById(id)) {
            throw new RuntimeException("Alert not found with id: " + id);
        }
        alertsRepository.deleteById(id);
    }
}