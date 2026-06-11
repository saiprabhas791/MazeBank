package com.cts.mazebank.service;

import com.cts.mazebank.model.Account;
import com.cts.mazebank.model.Transaction;
import com.cts.mazebank.model.Customer;
import com.cts.mazebank.repository.AccountRepository;
import com.cts.mazebank.repository.TransactionRepository;
import com.cts.mazebank.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@Service
public class TransactionService {

    // Keep ZoneId import available for conversions if needed; transactions are stored as UTC Instants

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Transactional
    public Transaction deposit(Long accountId, Double amount) {
        if (amount <= 0) throw new RuntimeException("Deposit amount must be greater than zero");
        // Verify account exists and belongs to authenticated customer
        Customer authCustomer = getAuthenticatedCustomer();
        Account account = accountRepository.findByIdAndCustomerId(accountId, authCustomer.getId())
                .orElseThrow(() -> new AccessDeniedException("You are not authorized to deposit into this account"));
        if (!account.getActive()) throw new RuntimeException("Account is deactivated");

        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setTransactionType("DEPOSIT");
        transaction.setAmount(amount);
        transaction.setDescription("Deposit of ₹" + amount);
        transaction.setTransactionDate(Instant.now());
        transaction.setAccount(account);
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction withdraw(Long accountId, Double amount) {
        if (amount <= 0) throw new RuntimeException("Withdrawal amount must be greater than zero");
        // Verify account exists and belongs to authenticated customer
        Customer authCustomer = getAuthenticatedCustomer();
        Account account = accountRepository.findByIdAndCustomerId(accountId, authCustomer.getId())
                .orElseThrow(() -> new AccessDeniedException("You are not authorized to withdraw from this account"));
        if (!account.getActive()) throw new RuntimeException("Account is deactivated");
        if (account.getBalance() < amount)
            throw new RuntimeException("Insufficient balance. Available: ₹" + account.getBalance());

        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);

        Transaction transaction = new Transaction();
        transaction.setTransactionType("WITHDRAWAL");
        transaction.setAmount(amount);
        transaction.setDescription("Withdrawal of ₹" + amount);
        transaction.setTransactionDate(Instant.now());
        transaction.setAccount(account);
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction transfer(Long fromAccountId, String toAccountNumber, Double amount) {
        if (amount <= 0) throw new RuntimeException("Transfer amount must be greater than zero");
        // Verify the source account belongs to authenticated customer
        Customer authCustomer = getAuthenticatedCustomer();
        Account fromAccount = accountRepository.findByIdAndCustomerId(fromAccountId, authCustomer.getId())
                .orElseThrow(() -> new AccessDeniedException("You are not authorized to transfer from this account"));
        Account toAccount = accountRepository.findByAccountNumber(toAccountNumber)
                .orElseThrow(() -> new RuntimeException("Destination account not found: " + toAccountNumber));

        if (!fromAccount.getActive()) throw new RuntimeException("Source account is deactivated");
        if (!toAccount.getActive()) throw new RuntimeException("Destination account is deactivated");
        if (fromAccount.getAccountNumber().equals(toAccount.getAccountNumber()))
            throw new RuntimeException("Self-transfer is not allowed");
        if (fromAccount.getBalance() < amount)
            throw new RuntimeException("Insufficient balance. Available: ₹" + fromAccount.getBalance());

        fromAccount.setBalance(fromAccount.getBalance() - amount);
        accountRepository.save(fromAccount);
        toAccount.setBalance(toAccount.getBalance() + amount);
        accountRepository.save(toAccount);

        Instant now = Instant.now();

        Transaction transaction = new Transaction();
        transaction.setTransactionType("TRANSFER");
        transaction.setAmount(amount);
        transaction.setDescription("Transfer of ₹" + amount + " to " + toAccountNumber);
        transaction.setTargetAccountNumber(toAccountNumber);
        transaction.setTransactionDate(now);
        transaction.setAccount(fromAccount);
        transactionRepository.save(transaction);

        Transaction creditTransaction = new Transaction();
        creditTransaction.setTransactionType("CREDIT");
        creditTransaction.setAmount(amount);
        creditTransaction.setDescription("Credit of ₹" + amount + " from " + fromAccount.getAccountNumber());
        creditTransaction.setTargetAccountNumber(fromAccount.getAccountNumber());
        creditTransaction.setTransactionDate(now);
        creditTransaction.setAccount(toAccount);
        transactionRepository.save(creditTransaction);

        return transaction;
    }

    public List<Transaction> getFilteredTransactions(String transactionType, String accountNumber, Instant startDate, Instant endDate) {
        return transactionRepository.findFilteredTransactions(transactionType, accountNumber, startDate, endDate);
    }

    public List<Transaction> getTransactionsByAccountId(Long accountId) {
        return transactionRepository.findByAccountIdOrderByTransactionDateDesc(accountId);
    }

    public List<Transaction> getTransactionsByCustomerId(Long customerId) {
        return transactionRepository.findByAccountCustomerIdOrderByTransactionDateDesc(customerId);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // Resolve authenticated customer from security context
    private Customer getAuthenticatedCustomer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) throw new AccessDeniedException("Unauthenticated");
        String email = auth.getName();
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found"));
    }
}
