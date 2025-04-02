package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.dto.ProfileResponse;
import com.dmes.pfeBackend.service.UserService;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserService userService;
    
    public UserProfileController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    public ResponseEntity<?> getCurrentUserProfile() {
        // Get authentication directly from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "No authentication found in security context"
            ));
        }
        
        Object principal = authentication.getPrincipal();
        
        // Debug information
        if (!(principal instanceof UserDetails)) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Principal is not a UserDetails instance",
                "principal_type", principal.getClass().getName(),
                "principal", principal.toString()
            ));
        }
        
        // Get username from UserDetails
        String username = ((UserDetails) principal).getUsername();
        
        // Use UserService to find the user and generate profile
        try {
            // Get user profile directly using username
            ProfileResponse profile = userService.getUserProfileByUsername(username);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Error fetching user profile",
                "message", e.getMessage()
            ));
        }
    }
}