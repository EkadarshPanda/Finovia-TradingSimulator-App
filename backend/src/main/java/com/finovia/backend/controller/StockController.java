package com.finovia.backend.controller;

import com.finovia.backend.dto.FinnhubQuote;
import com.finovia.backend.entity.Holding;
import com.finovia.backend.entity.Transaction;
import com.finovia.backend.entity.User;
import com.finovia.backend.repository.HoldingRepository;
import com.finovia.backend.repository.TransactionRepository;
import com.finovia.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    @Value("${finnhub.api.key}")
    private String finnhubApiKey;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HoldingRepository holdingRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/quote/{symbol}")
    public ResponseEntity<?> getStockQuote(@PathVariable String symbol) {
        try {
            String url = "https://finnhub.io/api/v1/quote?symbol=" + symbol.toUpperCase() + "&token=" + finnhubApiKey;
            // Fetch the data and map it to our helper class
            FinnhubQuote responseFromFinnhub = restTemplate.getForObject(url, FinnhubQuote.class);

            // Manually create the response object to send to the frontend
            // This forces the key to be "currentPrice"
            Map<String, Object> responseForFrontend = new HashMap<>();
            responseForFrontend.put("currentPrice", responseFromFinnhub.getCurrentPrice());

            return ResponseEntity.ok(responseForFrontend);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching stock data: " + e.getMessage());
        }
    }

    @PostMapping("/buy")
    public ResponseEntity<?> buyStock(@RequestBody Map<String, Object> payload) {
        // 1. Get the currently logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String symbol = ((String) payload.get("symbol")).toUpperCase();
        int quantityToBuy = (Integer) payload.get("quantity");

        // 2. Fetch the current stock price
        FinnhubQuote quote = restTemplate.getForObject(
                "https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=" + finnhubApiKey,
                FinnhubQuote.class
        );

        if (quote == null || quote.getCurrentPrice() == null || quote.getCurrentPrice().compareTo(BigDecimal.ZERO) == 0) {
            return ResponseEntity.badRequest().body("Could not fetch price for symbol: " + symbol);
        }
        BigDecimal currentPrice = quote.getCurrentPrice();
        BigDecimal totalCost = currentPrice.multiply(new BigDecimal(quantityToBuy));

        // 3. Check if the user has enough money
        if (user.getVirtualBalance().compareTo(totalCost) < 0) {
            return ResponseEntity.badRequest().body("Insufficient funds.");
        }

        // 4. Update user's balance
        user.setVirtualBalance(user.getVirtualBalance().subtract(totalCost));

        // 5. Update user's holdings
        Optional<Holding> existingHoldingOpt = holdingRepository.findByUserAndStockSymbol(user, symbol);
        Holding holding;
        if (existingHoldingOpt.isPresent()) {
            // User already owns this stock, so update the existing holding
            holding = existingHoldingOpt.get();
            BigDecimal oldTotalValue = holding.getAveragePurchasePrice().multiply(new BigDecimal(holding.getQuantity()));
            int newQuantity = holding.getQuantity() + quantityToBuy;
            BigDecimal newTotalValue = oldTotalValue.add(totalCost);
            holding.setAveragePurchasePrice(newTotalValue.divide(new BigDecimal(newQuantity), RoundingMode.HALF_UP).setScale(2, RoundingMode.HALF_UP));
            holding.setQuantity(newQuantity);
        } else {
            // This is a new stock for the user
            holding = new Holding();
            holding.setUser(user);
            holding.setStockSymbol(symbol);
            holding.setQuantity(quantityToBuy);
            holding.setAveragePurchasePrice(currentPrice);
        }

        // 6. Create a transaction record
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setStockSymbol(symbol);
        transaction.setTransactionType("BUY");
        transaction.setQuantity(quantityToBuy);
        transaction.setPricePerShare(currentPrice);
        transaction.setTimestamp(LocalDateTime.now());

        // 7. Save everything to the database
        userRepository.save(user);
        holdingRepository.save(holding);
        transactionRepository.save(transaction);

        return ResponseEntity.ok("Purchase successful!");
    }

    // Add this new method inside your StockController class

    @PostMapping("/sell")
    public ResponseEntity<?> sellStock(@RequestBody Map<String, Object> payload) {
        // 1. Get the currently logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String symbol = ((String) payload.get("symbol")).toUpperCase();
        int quantityToSell = (Integer) payload.get("quantity");

        // 2. Find the user's holding for this stock
        Holding holding = holdingRepository.findByUserAndStockSymbol(user, symbol)
                .orElseThrow(() -> new RuntimeException("Holding not found for symbol: " + symbol));

        // 3. Check if they have enough shares to sell
        if (holding.getQuantity() < quantityToSell) {
            return ResponseEntity.badRequest().body("Insufficient shares to sell.");
        }

        // 4. Fetch the current stock price
        FinnhubQuote quote = restTemplate.getForObject(
                "https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=" + finnhubApiKey,
                FinnhubQuote.class
        );
        if (quote == null || quote.getCurrentPrice() == null || quote.getCurrentPrice().compareTo(BigDecimal.ZERO) == 0) {
            return ResponseEntity.badRequest().body("Could not fetch price for symbol: " + symbol);
        }
        BigDecimal currentPrice = quote.getCurrentPrice();
        BigDecimal totalProceeds = currentPrice.multiply(new BigDecimal(quantityToSell));

        // 5. Update user's balance
        user.setVirtualBalance(user.getVirtualBalance().add(totalProceeds));

        // 6. Update the holding
        holding.setQuantity(holding.getQuantity() - quantityToSell);

        // 7. Create a transaction record
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setStockSymbol(symbol);
        transaction.setTransactionType("SELL");
        transaction.setQuantity(quantityToSell);
        transaction.setPricePerShare(currentPrice);
        transaction.setTimestamp(LocalDateTime.now());

        // 8. Save changes to the database
        userRepository.save(user);
        transactionRepository.save(transaction);
        if (holding.getQuantity() == 0) {
            // If user sold all shares, remove the holding record
            holdingRepository.delete(holding);
        } else {
            holdingRepository.save(holding);
        }

        return ResponseEntity.ok("Sale successful!");
    }

    @GetMapping("/recommendation")
    public ResponseEntity<?> getRecommendationTrends(@RequestParam String symbol) {
        try {
            String url = "https://finnhub.io/api/v1/stock/recommendation?symbol=" + symbol.toUpperCase() + "&token=" + finnhubApiKey;
            
            // Fetch the data from Finnhub API
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> responseFromFinnhub = restTemplate.getForObject(url, List.class);
            
            if (responseFromFinnhub == null) {
                return ResponseEntity.status(500).body("Error fetching recommendation data");
            }
            
            return ResponseEntity.ok(responseFromFinnhub);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching recommendation data: " + e.getMessage());
        }
    }
}