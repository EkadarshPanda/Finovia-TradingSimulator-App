package com.finovia.backend.repository;

import com.finovia.backend.entity.Holding;
import com.finovia.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface HoldingRepository extends JpaRepository<Holding, Long> {
    Optional<Holding> findByUserAndStockSymbol(User user, String stockSymbol);
    List<Holding> findByUser(User user);
}