package com.dmes.pfeBackend.dto;

import lombok.Data;

@Data
public class AccessPermissionRequest {
    private String patientId;
    private String doctorId;
    private Long expiresAt;
}