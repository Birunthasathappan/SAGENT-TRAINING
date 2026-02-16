package com.example.budget_tracker.controller;

import com.example.budget_tracker.entity.User;
import com.example.budget_tracker.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Handles POST /users
    @PostMapping
    public ResponseEntity<User> register(@RequestBody User user) {
        User saved = userService.registerUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Handles POST /users/register (optional, keeps backward compatibility)
    @PostMapping("/register")
    public ResponseEntity<User> registerAlt(@RequestBody User user) {
        User saved = userService.registerUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Handles GET /users
    @GetMapping
    public List<User> getAll() {
        return userService.getAllUsers();
    }
}