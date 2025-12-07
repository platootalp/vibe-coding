package com.example.sddkit.infrastructure.repository;

import com.example.sddkit.domain.model.User;
import com.example.sddkit.domain.repository.UserRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaUserRepository extends JpaRepository<User, Long>, UserRepository {
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameAndDeletedAtIsNull(String username);
}