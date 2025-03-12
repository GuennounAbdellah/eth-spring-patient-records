package com.dmes.pfeBackend.dto;

import javax.validation.constraints.NotBlank;

public class ConsultationRequest {
    @NotBlank
    private String patientId;
    
    @NotBlank
    private String details;
    
    private String metadata;

    // Getters and setters
    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }
}