package com.cts.mazebank.controller;

import com.cts.mazebank.model.Transaction;
import com.cts.mazebank.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.cts.mazebank.model.Customer;
import com.cts.mazebank.repository.CustomerRepository;
import org.springframework.security.access.AccessDeniedException;
import java.util.Map;

/**
 * Transaction Controller - handles deposit, withdraw, and transfer operations.
 */
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private com.cts.mazebank.repository.AccountRepository accountRepository;

    // Deposit money into an account
    @PostMapping("/deposit")
    public ResponseEntity<Transaction> deposit(@RequestBody Map<String, Object> request) {
        Long accountId = Long.valueOf(request.get("accountId").toString());
        Double amount = Double.valueOf(request.get("amount").toString());
        return new ResponseEntity<>(transactionService.deposit(accountId, amount), HttpStatus.CREATED);
    }

    // Withdraw money from an account
    @PostMapping("/withdraw")
    public ResponseEntity<Transaction> withdraw(@RequestBody Map<String, Object> request) {
        Long accountId = Long.valueOf(request.get("accountId").toString());
        Double amount = Double.valueOf(request.get("amount").toString());
        return new ResponseEntity<>(transactionService.withdraw(accountId, amount), HttpStatus.CREATED);
    }

    // Transfer money between accounts
    @PostMapping("/transfer")
    public ResponseEntity<Transaction> transfer(@RequestBody Map<String, Object> request) {
        Long fromAccountId = Long.valueOf(request.get("fromAccountId").toString());
        String toAccountNumber = request.get("toAccountNumber").toString();
        Double amount = Double.valueOf(request.get("amount").toString());
        return new ResponseEntity<>(transactionService.transfer(fromAccountId, toAccountNumber, amount), HttpStatus.CREATED);
    }


    // Get all transactions for a customer
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Transaction>> getByCustomer(@PathVariable Long customerId) {
        // Allow admin to fetch any customer's transactions; customers can only fetch their own
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) throw new AccessDeniedException("Unauthenticated");
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            return ResponseEntity.ok(transactionService.getTransactionsByCustomerId(customerId));
        }
        // resolve authenticated customer and enforce id match
        Customer authCustomer = customerRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found"));
        if (!authCustomer.getId().equals(customerId)) throw new AccessDeniedException("Not authorized to access other customer's transactions");
        return ResponseEntity.ok(transactionService.getTransactionsByCustomerId(customerId));
    }

    // Get transaction history for an account with ownership check
    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Transaction>> getByAccount(@PathVariable Long accountId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) throw new AccessDeniedException("Unauthenticated");
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            return ResponseEntity.ok(transactionService.getTransactionsByAccountId(accountId));
        }
        Customer authCustomer = customerRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found"));
        // verify ownership by checking account belongs to authCustomer
        boolean owner = accountRepository.findByIdAndCustomerId(accountId, authCustomer.getId()).isPresent();
        if (!owner) throw new AccessDeniedException("Not authorized to access this account's transactions");
        return ResponseEntity.ok(transactionService.getTransactionsByAccountId(accountId));
    }
}
