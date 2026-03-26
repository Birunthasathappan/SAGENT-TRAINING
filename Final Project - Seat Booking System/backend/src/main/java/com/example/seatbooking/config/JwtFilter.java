package com.example.seatbooking.config;

import com.example.seatbooking.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.Key;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    @Value("${jwt.secret:bookit-secret-key-change-in-production-min-256-bits}")
    private String jwtSecret;

    public JwtFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                String email = claims.getSubject();
                String role  = claims.get("role", String.class);

                // ── DEBUG: print to Spring Boot console ──
                System.out.println("====================================");
                System.out.println("JWT DEBUG → URL  : " + request.getRequestURI());
                System.out.println("JWT DEBUG → Email: " + email);
                System.out.println("JWT DEBUG → Role : " + role);
                System.out.println("JWT DEBUG → Auth : ROLE_" + role);
                System.out.println("====================================");

                if (email != null && role != null
                        && SecurityContextHolder.getContext().getAuthentication() == null) {

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    List.of(new SimpleGrantedAuthority("ROLE_" + role))
                            );
                    SecurityContextHolder.getContext().setAuthentication(auth);

                } else if (role == null) {
                    // ── Role is null in token — this causes 403 ──
                    System.out.println("JWT DEBUG → ⚠️ ROLE IS NULL! Token has no role claim.");
                    System.out.println("JWT DEBUG → All claims: " + claims);
                }

            } catch (Exception e) {
                System.out.println("JWT DEBUG → ❌ Token parse failed: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}