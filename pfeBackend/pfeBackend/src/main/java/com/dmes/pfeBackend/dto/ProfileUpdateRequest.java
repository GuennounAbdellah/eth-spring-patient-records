package com.dmes.pfeBackend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProfileUpdateRequest {
    // Common fields for all users
    private String email;
    private String walletAddress;
    
    // Patient-specific fields
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String allergies;
    private String chronicConditions;
    private String emergencyContact;
    
    // Doctor-specific fields
    private String specialization;
    private String hospitalAffiliation;
    private String professionalBio;
    private String officeHours;
    
    // Admin-specific fields
    private String department;
    private String securityClearanceLevel;
    private Boolean emergencyAccessGrantor;
}