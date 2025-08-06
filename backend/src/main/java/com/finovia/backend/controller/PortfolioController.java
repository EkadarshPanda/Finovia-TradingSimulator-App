package com.finovia.backend.controller;

import com.finovia.backend.entity.Holding;
import com.finovia.backend.entity.User;
import com.finovia.backend.repository.HoldingRepository;
import com.finovia.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HoldingRepository holdingRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMyPortfolio() {
        // Get the currently logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get all holdings for that user
        List<Holding> holdings = holdingRepository.findByUser(user);

        // Create a response object
        Map<String, Object> portfolioData = new HashMap<>();
        portfolioData.put("virtualBalance", user.getVirtualBalance());
        portfolioData.put("holdings", holdings);

        return ResponseEntity.ok(portfolioData);
    }
}