package com.example.seatbooking.controller;

import com.example.seatbooking.entity.User;
import com.example.seatbooking.service.UserService;
import com.example.seatbooking.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Key;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.secret:bookit-secret-key-change-in-production-min-256-bits}")
    private String jwtSecret;

    public AuthController(UserService userService,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ── Register ──────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());  // encoded inside UserService
        user.setPhoneNo(req.getPhoneNo());

        // Safely parse role string → enum, default USER
        try {
            user.setRole(User.Role.valueOf(
                    req.getRole() != null ? req.getRole().toUpperCase() : "USER"
            ));
        } catch (IllegalArgumentException e) {
            user.setRole(User.Role.USER);
        }

        User saved = userService.registerUser(user);
        String token = generateToken(saved);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                        "userId", saved.getUserId(),
                        "name",   saved.getName(),
                        "email",  saved.getEmail(),
                        "role",   saved.getRole().name()
                )
        ));
    }

    // ── Login ─────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid email or password"));
        }

        String token = generateToken(user);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                        "userId", user.getUserId(),
                        "name",   user.getName(),
                        "email",  user.getEmail(),
                        "role",   user.getRole().name()
                )
        ));
    }

    // ── JWT ───────────────────────────────────────────────────
    private String generateToken(User user) {
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role",   user.getRole().name())
                .claim("userId", user.getUserId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86_400_000L)) // 24h
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ── DTOs ──────────────────────────────────────────────────
    static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String phoneNo;
        private String role;

        public String getName()     { return name; }
        public String getEmail()    { return email; }
        public String getPassword() { return password; }
        public String getPhoneNo()  { return phoneNo; }
        public String getRole()     { return role; }

        public void setName(String v)     { this.name = v; }
        public void setEmail(String v)    { this.email = v; }
        public void setPassword(String v) { this.password = v; }
        public void setPhoneNo(String v)  { this.phoneNo = v; }
        public void setRole(String v)     { this.role = v; }
    }

    static class LoginRequest {
        private String email;
        private String password;

        public String getEmail()    { return email; }
        public String getPassword() { return password; }
        public void setEmail(String v)    { this.email = v; }
        public void setPassword(String v) { this.password = v; }
    }
}