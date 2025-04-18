package com.dmes.pfeBackend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientRegistrationRequest {
    // Common fields
    private String username;
    private String password;
    private String email;
    private String walletAddress;
    
    // Patient-specific fields
    private String medicalRecordNumber;
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String allergies;
    private String chronicConditions;
    private String emergencyContact;
    
    // Role is implicit
    private String role = "PATIENT";
}