package com.dmes.pfeBackend.repository;

import com.dmes.pfeBackend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, String> {
    // Doctor-specific queries
}