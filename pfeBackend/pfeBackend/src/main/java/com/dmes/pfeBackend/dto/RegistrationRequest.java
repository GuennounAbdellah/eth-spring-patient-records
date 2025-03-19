package com.dmes.pfeBackend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RegistrationRequest {
    // Common fields
    private String username;
    private String password;
    private String role;
    private String walletAddress;
    
    // Patient fields
    private String medicalRecordNumber;
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String allergies;
    private String chronicConditions;
    private String emergencyContact;
    
    // Doctor fields
    private String licenseNumber;
    private String specialization;
    private String hospitalAffiliation;
    private String professionalBio;
    private String officeHours;
    
    // Admin fields
    private String department;
    private String securityClearanceLevel;
    private Boolean emergencyAccessGrantor;
}