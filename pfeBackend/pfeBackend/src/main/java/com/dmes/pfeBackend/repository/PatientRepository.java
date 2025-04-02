package com.dmes.pfeBackend.repository;

import com.dmes.pfeBackend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, String> {
    // Patient-specific queries
}