package com.example.seatbooking.service;

import com.example.seatbooking.entity.User;
import com.example.seatbooking.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // OTP store - email → {otp, expiry}
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> otpExpiry = new ConcurrentHashMap<>();

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered: " + user.getEmail());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    // ── Forgot Password - Send OTP ─────────────────────────
    public void sendForgotPasswordOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with email: " + email));

        // Generate 6 digit OTP
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        // Store OTP with 5 min expiry
        otpStore.put(email, otp);
        otpExpiry.put(email, LocalDateTime.now().plusMinutes(5));

        // Send mail
        emailService.sendForgotPasswordOtp(user.getName(), email, otp);
        System.out.println("✅ OTP sent to: " + email);
    }

    // ── Verify OTP ─────────────────────────────────────────
    public void verifyOtp(String email, String otp) {
        String storedOtp = otpStore.get(email);
        LocalDateTime expiry = otpExpiry.get(email);

        if (storedOtp == null || expiry == null) {
            throw new RuntimeException("OTP not found. Please request again.");
        }
        if (LocalDateTime.now().isAfter(expiry)) {
            otpStore.remove(email);
            otpExpiry.remove(email);
            throw new RuntimeException("OTP expired. Please request again.");
        }
        if (!storedOtp.equals(otp)) {
            throw new RuntimeException("Invalid OTP. Please try again.");
        }
    }

    // ── Reset Password ──────────────────────────────────────
    public void resetPassword(String email, String otp, String newPassword) {
        // Verify OTP first
        verifyOtp(email, otp);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Cleanup OTP
        otpStore.remove(email);
        otpExpiry.remove(email);

        System.out.println("✅ Password reset successful for: " + email);
    }
}