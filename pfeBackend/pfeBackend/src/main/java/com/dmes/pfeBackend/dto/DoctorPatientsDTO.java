package com.dmes.pfeBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorPatientsDTO {
    private String userId;
    private String username;
    private String walletAddress;
    private String bloodGroup;

    // Could add more fields as needed (e.g., name, specialization for patients)
}