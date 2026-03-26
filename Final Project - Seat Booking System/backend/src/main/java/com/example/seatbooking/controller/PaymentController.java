package com.example.seatbooking.controller;

import com.example.seatbooking.entity.Payment;
import com.example.seatbooking.entity.Payment.Status;
import com.example.seatbooking.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(@Valid @RequestBody Payment payment) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(paymentService.createPayment(payment));
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ref/{referenceCode}")
    public ResponseEntity<Payment> getPaymentByReferenceCode(
            @PathVariable String referenceCode) {
        return paymentService.getPaymentByReferenceCode(referenceCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Payment>> getPaymentsByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentsByBooking(bookingId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(@PathVariable Status status) {
        return ResponseEntity.ok(paymentService.getPaymentsByStatus(status));
    }

    @GetMapping("/mode/{payMode}")
    public ResponseEntity<List<Payment>> getPaymentsByPayMode(@PathVariable String payMode) {
        return ResponseEntity.ok(paymentService.getPaymentsByPayMode(payMode));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getPaymentsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUser(userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Payment> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam Status status) {
        return ResponseEntity.ok(paymentService.updatePaymentStatus(id, status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(
            @PathVariable Long id,
            @Valid @RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.updatePayment(id, payment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}