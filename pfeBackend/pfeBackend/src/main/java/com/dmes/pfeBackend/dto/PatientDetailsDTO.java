package com.dmes.pfeBackend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientDetailsDTO {
    private String userId;
    private String username;
    private String fullName;
    private String email;
    private String medicalRecordNumber;
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String allergies;
    private String chronicConditions;
    private String emergencyContact;
    private String walletAddress;
}