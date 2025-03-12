package com.dmes.pfeBackend.dto;

import jakarta.validation.constraints.NotBlank;

public class AccessPermissionRequest {
    @NotBlank
    private String patientId;
    
    @NotBlank
    private String doctorId;
    
    private Long expiresAt;

    // Getters and setters
    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public Long getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Long expiresAt) {
        this.expiresAt = expiresAt;
    }
}