// UserRepository.java
package com.dmes.pfeBackend.repository;

import com.dmes.pfeBackend.model.Role;
import com.dmes.pfeBackend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByWalletAddress(String walletAddress);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Page<User> findByRole(Role role, Pageable pageable);
}