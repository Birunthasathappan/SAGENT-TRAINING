package com.example.seatbooking.controller;

import com.example.seatbooking.entity.User;
import com.example.seatbooking.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ── Forgot Password - Send OTP ──────────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody Map<String, String> body) {
        try {
            userService.sendForgotPasswordOtp(body.get("email"));
            return ResponseEntity.ok(Map.of(
                    "message", "OTP sent to your email",
                    "email", body.get("email")
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── Verify OTP ──────────────────────────────────────────
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(
            @RequestBody Map<String, String> body) {
        try {
            userService.verifyOtp(body.get("email"), body.get("otp"));
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── Reset Password ───────────────────────────────────────
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody Map<String, String> body) {
        try {
            userService.resetPassword(
                    body.get("email"),
                    body.get("otp"),
                    body.get("newPassword")
            );
            return ResponseEntity.ok(Map.of("message", "Password reset successful"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}