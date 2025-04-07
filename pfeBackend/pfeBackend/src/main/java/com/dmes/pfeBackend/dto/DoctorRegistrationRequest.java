package com.dmes.pfeBackend.dto;

import lombok.Data;

@Data
public class DoctorRegistrationRequest {
    // Common fields
    private String username;
    private String password;
    private String email;
    private String walletAddress;
    
    // Doctor-specific fields
    private String licenseNumber;
    private String specialization;
    private String hospitalAffiliation;
    private String professionalBio;
    private String officeHours;
    
    // Role is implicit
    private String role = "DOCTOR";
}