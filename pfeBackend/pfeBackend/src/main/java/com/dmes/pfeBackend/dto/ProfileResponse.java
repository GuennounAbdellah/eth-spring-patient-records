package com.dmes.pfeBackend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ProfileResponse {
    // Common fields for all users
    private String userId;
    private String username;
    private String email;
    private String role;
    private String walletAddress;
    private boolean active;
    
    // Role-specific fields included for all responses
    // (will be null if not applicable to the user's role)
    
    // Doctor fields
    private String licenseNumber;
    private String specialization;
    private String hospitalAffiliation;
    private String professionalBio;
    private String officeHours;
    
    // Patient fields
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String allergies;
    private String chronicConditions;
    private String emergencyContact;
    
    // Admin fields
    private String department;
    private String securityClearanceLevel;
    private Boolean emergencyAccessGrantor;
}