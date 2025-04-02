package com.dmes.pfeBackend.repository;

import com.dmes.pfeBackend.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, String> {
    // Admin-specific queries
}