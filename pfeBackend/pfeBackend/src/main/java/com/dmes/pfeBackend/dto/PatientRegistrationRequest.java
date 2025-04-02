package com.dmes.pfeBackend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientRegistrationRequest {
    private String username;
    private String password;
    private String email;
    private String fullName;
    private String medicalRecordNumber;
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String walletAddress;
}