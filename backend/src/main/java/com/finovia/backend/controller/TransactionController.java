package com.finovia.backend.controller;

import com.finovia.backend.entity.Transaction;
import com.finovia.backend.entity.User;
import com.finovia.backend.repository.TransactionRepository;
import com.finovia.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentTransactions() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get recent transactions (last 10)
            List<Transaction> transactions = transactionRepository.findByUserOrderByTimestampDesc(user);

            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching transactions: " + e.getMessage());
        }
    }

    @GetMapping("/daily-summary")
    public ResponseEntity<?> getDailySummary() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            LocalDate today = LocalDate.now();
            LocalDateTime startOfDay = today.atStartOfDay();
            LocalDateTime endOfDay = today.atTime(23, 59, 59);

            List<Transaction> todayTransactions = transactionRepository.findByUserAndTimestampBetweenOrderByTimestampDesc(
                    user, startOfDay, endOfDay);

            // Calculate summary
            int totalTrades = todayTransactions.size();
            int totalVolume = todayTransactions.stream().mapToInt(Transaction::getQuantity).sum();
            BigDecimal totalValue = todayTransactions.stream()
                    .map(t -> t.getPricePerShare().multiply(new BigDecimal(t.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Calculate P/L (simplified - you might want to enhance this)
            BigDecimal profitLoss = BigDecimal.ZERO;
            for (Transaction t : todayTransactions) {
                if ("SELL".equals(t.getTransactionType())) {
                    profitLoss = profitLoss.add(t.getPricePerShare().multiply(new BigDecimal(t.getQuantity())));
                } else {
                    profitLoss = profitLoss.subtract(t.getPricePerShare().multiply(new BigDecimal(t.getQuantity())));
                }
            }

            Map<String, Object> summary = new HashMap<>();
            summary.put("totalTrades", totalTrades);
            summary.put("totalVolume", totalVolume);
            summary.put("totalValue", totalValue);
            summary.put("profitLoss", profitLoss);

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching daily summary: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllTransactions() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Transaction> transactions = transactionRepository.findByUserOrderByTimestampDesc(user);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching transactions: " + e.getMessage());
        }
    }
} 