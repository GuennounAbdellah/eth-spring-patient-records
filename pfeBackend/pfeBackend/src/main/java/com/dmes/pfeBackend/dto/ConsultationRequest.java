package com.dmes.pfeBackend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ConsultationRequest {
    @NotBlank
    private String patientId;
    
    @NotBlank
    private String details;
    
    private String metadata;

}