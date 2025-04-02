package com.dmes.pfeBackend.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private ProfileResponse profile;
    
    public AuthResponse(String token, ProfileResponse profile) {
        this.token = token;
        this.profile = profile;
    }
}