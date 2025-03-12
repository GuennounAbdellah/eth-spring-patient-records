package com.dmes.pfeBackend.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class DeleteConsultationRequest {
    @NotBlank
    private String patientId;
    
    @NotNull
    private Long timestamp;

    // Getters and setters
    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
}