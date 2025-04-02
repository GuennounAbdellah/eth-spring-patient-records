package com.dmes.pfeBackend.dto;

import lombok.Data;

@Data
public class DoctorRegistrationRequest {
    private String username;
    private String password;
    private String email;
    private String fullName;
    private String licenseNumber;
    private String specialization;
    private String hospitalAffiliation;
    private String walletAddress;
}