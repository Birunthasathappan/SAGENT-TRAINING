package com.example.seatbooking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()

                        // ✅ Forgot Password - Token தேவையில்ல
                        .requestMatchers("/api/users/forgot-password").permitAll()
                        .requestMatchers("/api/users/verify-otp").permitAll()
                        .requestMatchers("/api/users/reset-password").permitAll()

                        // ── Public read access ──
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/events/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/venues/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/screenings/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/screening-seats/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/seats/**").permitAll()

                        // ── Events — ADMIN + ORGANIZER ──
                        .requestMatchers(org.springframework.http.HttpMethod.POST,   "/api/events/**").hasAnyRole("ADMIN", "ORGANIZER")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT,    "/api/events/**").hasAnyRole("ADMIN", "ORGANIZER")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/events/**").hasAnyRole("ADMIN", "ORGANIZER")

                        // ── Venues — ADMIN + ORGANIZER ──
                        .requestMatchers(org.springframework.http.HttpMethod.POST,   "/api/venues/**").hasAnyRole("ADMIN", "ORGANIZER")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT,    "/api/venues/**").hasAnyRole("ADMIN", "ORGANIZER")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/venues/**").hasAnyRole("ADMIN", "ORGANIZER")

                        // ── Screenings — ADMIN + ORGANIZER ──
                        .requestMatchers(org.springframework.http.HttpMethod.POST,   "/api/screenings/**").hasAnyRole("ADMIN", "ORGANIZER")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT,    "/api/screenings/**").hasAnyRole("ADMIN", "ORGANIZER")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/screenings/**").hasAnyRole("ADMIN", "ORGANIZER")

                        // ── Seats — ADMIN + ORGANIZER ──
                        .requestMatchers(org.springframework.http.HttpMethod.POST,   "/api/seats/**").hasAnyRole("ADMIN", "ORGANIZER")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT,    "/api/seats/**").hasAnyRole("ADMIN", "ORGANIZER")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/seats/**").hasAnyRole("ADMIN", "ORGANIZER")

                        // ── Screening Seats — ADMIN + ORGANIZER ──
                        .requestMatchers(org.springframework.http.HttpMethod.POST,   "/api/screening-seats/**").hasAnyRole("ADMIN", "ORGANIZER")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT,    "/api/screening-seats/**").hasAnyRole("ADMIN", "ORGANIZER")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/screening-seats/**").hasAnyRole("ADMIN", "ORGANIZER")

                        // ── Bookings ──
                        .requestMatchers(org.springframework.http.HttpMethod.GET,    "/api/bookings/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")
                        .requestMatchers(org.springframework.http.HttpMethod.POST,   "/api/bookings/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT,    "/api/bookings/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH,  "/api/bookings/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/bookings/**").hasAnyRole("ADMIN", "ORGANIZER")

                        // ── Payments ──
                        .requestMatchers(org.springframework.http.HttpMethod.GET,    "/api/payments/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")
                        .requestMatchers(org.springframework.http.HttpMethod.POST,   "/api/payments/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT,    "/api/payments/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH,  "/api/payments/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")

                        // ── Booking Items ──
                        .requestMatchers(org.springframework.http.HttpMethod.GET,    "/api/booking-items/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")
                        .requestMatchers(org.springframework.http.HttpMethod.POST,   "/api/booking-items/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT,    "/api/booking-items/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH,  "/api/booking-items/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")

                        // ── Cancellations ──
                        .requestMatchers(org.springframework.http.HttpMethod.GET,    "/api/cancellations/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")
                        .requestMatchers(org.springframework.http.HttpMethod.POST,   "/api/cancellations/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH,  "/api/cancellations/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")

                        // ── Alerts ──
                        .requestMatchers(org.springframework.http.HttpMethod.GET,    "/api/alerts/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")
                        .requestMatchers(org.springframework.http.HttpMethod.POST,   "/api/alerts/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")
                        .requestMatchers(org.springframework.http.HttpMethod.PATCH,  "/api/alerts/**").hasAnyRole("ADMIN", "ORGANIZER", "USER")

                        .anyRequest().authenticated()
                )
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}