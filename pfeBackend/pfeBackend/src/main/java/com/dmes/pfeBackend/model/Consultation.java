package com.dmes.pfeBackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {
    private String patientId;
    private String doctorId;
    private String details;
    private String metadata;
    private long timestamp;
    private boolean deleted;
}