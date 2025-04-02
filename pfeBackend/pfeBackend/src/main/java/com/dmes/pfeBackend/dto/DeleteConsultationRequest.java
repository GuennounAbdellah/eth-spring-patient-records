package com.dmes.pfeBackend.dto;

import lombok.Data;

@Data
public class DeleteConsultationRequest {
    private String patientId;
    private Long timestamp;
}