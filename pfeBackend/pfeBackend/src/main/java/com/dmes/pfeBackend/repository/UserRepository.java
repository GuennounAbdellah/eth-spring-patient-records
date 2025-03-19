// UserRepository.java
package com.dmes.pfeBackend.repository;

import com.dmes.pfeBackend.model.Role;
import com.dmes.pfeBackend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    Page<User> findByRole(Role role, Pageable pageable);
    Optional<User> findByWalletAddress(String walletAddress);
}