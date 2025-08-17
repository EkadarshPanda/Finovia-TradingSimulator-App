package com.finovia.backend.repository;

import com.finovia.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional; // Import Optional

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // These methods allow Spring Data JPA to generate the queries for us
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}