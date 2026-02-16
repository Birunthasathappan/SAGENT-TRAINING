package com.example.budget_tracker.controller;

import com.example.budget_tracker.entity.Income;
import com.example.budget_tracker.service.IncomeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/income")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    // Add income
    @PostMapping
    public Income addIncome(@RequestBody Income income) {
        return incomeService.addIncome(income);
    }

    // Get all incomes
    @GetMapping
    public List<Income> getAllIncome() {
        return incomeService.getAllIncome();
    }
}
