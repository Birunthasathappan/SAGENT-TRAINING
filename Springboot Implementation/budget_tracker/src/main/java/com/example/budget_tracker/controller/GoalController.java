package com.example.budget_tracker.controller;

import com.example.budget_tracker.entity.Goal;
import com.example.budget_tracker.service.GoalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @PostMapping
    public Goal addGoal(@RequestBody Goal goal) {
        return goalService.saveGoal(goal);
    }

    @GetMapping
    public List<Goal> getAllGoals() {
        return goalService.getAllGoals();
    }
}
