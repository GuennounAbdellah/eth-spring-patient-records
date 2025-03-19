package com.dmes.pfeBackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserStatusUpdateRequest {
    @NotBlank
    private String userId;
    
    @NotNull
    private Boolean isActive;

}
