package com.finovia.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

// This class maps to the JSON response from Finnhub's /quote endpoint
public class FinnhubQuote {

    @JsonProperty("c")
    private BigDecimal currentPrice;

    // Getters and Setters
    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }
}