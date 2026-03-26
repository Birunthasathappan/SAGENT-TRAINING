package com.example.seatbooking.controller;

import com.example.seatbooking.entity.Alerts;
import com.example.seatbooking.service.AlertsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/alerts")
public class AlertsController {

    private final AlertsService alertsService;

    public AlertsController(AlertsService alertsService) {
        this.alertsService = alertsService;
    }

    // ✅ Return safe Map instead of entity to avoid lazy load crash
    @PostMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> createAlert(@Valid @RequestBody Alerts alert) {
        Alerts saved = alertsService.createAlert(alert);
        Map<String, Object> response = new HashMap<>();
        response.put("alertId", saved.getAlertId());
        response.put("message", saved.getMessage());
        response.put("type", saved.getType());
        response.put("isRead", saved.getIsRead());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<Alerts>> getAllAlerts() {
        return ResponseEntity.ok(alertsService.getAllAlerts());
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<Alerts> getAlertById(@PathVariable Long id) {
        return alertsService.getAlertById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Alerts>> getAlertsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(alertsService.getAlertsByUser(userId));
    }

    @GetMapping("/booking/{bookingId}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Alerts>> getAlertsByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(alertsService.getAlertsByBooking(bookingId));
    }

    @GetMapping("/user/{userId}/unread")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Alerts>> getUnreadAlerts(@PathVariable Long userId) {
        return ResponseEntity.ok(alertsService.getUnreadAlertsByUser(userId));
    }

    @GetMapping("/user/{userId}/read")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Alerts>> getReadAlerts(@PathVariable Long userId) {
        return ResponseEntity.ok(alertsService.getReadAlertsByUser(userId));
    }

    @GetMapping("/user/{userId}/unread/count")
    @Transactional(readOnly = true)
    public ResponseEntity<Long> countUnreadAlerts(@PathVariable Long userId) {
        return ResponseEntity.ok(alertsService.countUnreadAlerts(userId));
    }

    @GetMapping("/type/{type}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Alerts>> getAlertsByType(@PathVariable String type) {
        return ResponseEntity.ok(alertsService.getAlertsByType(type));
    }

    @PatchMapping("/{id}/read")
    @Transactional
    public ResponseEntity<Alerts> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(alertsService.markAsRead(id));
    }

    @PatchMapping("/user/{userId}/read-all")
    @Transactional
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
        alertsService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        alertsService.deleteAlert(id);
        return ResponseEntity.noContent().build();
    }
}