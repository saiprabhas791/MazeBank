package com.cts.mazebank.controller;

import com.cts.mazebank.model.Account;
import com.cts.mazebank.model.Customer;
import com.cts.mazebank.model.Transaction;
import com.cts.mazebank.service.AccountService;
import com.cts.mazebank.service.CustomerService;
import com.cts.mazebank.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Admin Controller - admin-only operations for monitoring the bank.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final ZoneId IST = ZoneId.of("Asia/Kolkata");

    @Autowired
    private CustomerService customerService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private TransactionService transactionService;

    // Get all customers
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    // Get all accounts
    @GetMapping("/accounts")
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    // Get all transactions
    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    // Get filtered transactions
    @GetMapping("/transactions/filter")
    public ResponseEntity<List<Transaction>> getFilteredTransactions(
            @RequestParam(required = false) String transactionType,
            @RequestParam(required = false) String accountNumber,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Instant start = null;
        Instant end = null;
        if (startDate != null && !startDate.isEmpty()) {
            LocalDate date = LocalDate.parse(startDate);
            // Interpret provided date as start of day in server default timezone, then convert to Instant (UTC)
            start = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
        }
        if (endDate != null && !endDate.isEmpty()) {
            LocalDate date = LocalDate.parse(endDate);
            end = date.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant();
        }
        String type = (transactionType != null && !transactionType.isEmpty()) ? transactionType : null;
        String accNum = (accountNumber != null && !accountNumber.isEmpty()) ? accountNumber : null;
        return ResponseEntity.ok(transactionService.getFilteredTransactions(type, accNum, start, end));
    }

    // Get dashboard summary
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalCustomers", customerService.getAllCustomers().size());
        dashboard.put("totalAccounts", accountService.getAllAccounts().size());
        dashboard.put("totalTransactions", transactionService.getAllTransactions().size());
        return ResponseEntity.ok(dashboard);
    }
}




