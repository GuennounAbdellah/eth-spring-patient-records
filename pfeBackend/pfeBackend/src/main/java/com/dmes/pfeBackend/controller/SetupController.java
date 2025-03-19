/*
 it's used to create the first admin in the database so we can delete it after the first run
 the setup key is used to make sure that the request is coming from the right source 
 because we don't want to expose the endpoint to the public
 
 */
/* 


package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.model.Admin;
import com.dmes.pfeBackend.model.Role;
import com.dmes.pfeBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/setup")
public class SetupController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public SetupController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/admin")
    public ResponseEntity<?> createFirstAdmin(@RequestBody Map<String, String> request) {
        // Check setup key for minimal security
        if (!"SETUP_SECRET_KEY".equals(request.get("setupKey"))) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid setup key"
            ));
        }
        
        try {
            // Create admin with encoded password
            Admin admin = new Admin();
            admin.setId(UUID.randomUUID().toString());
            admin.setUsername(request.get("username"));
            admin.setPasswordHash(passwordEncoder.encode(request.get("password")));
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            admin.setWalletAddress(request.get("walletAddress"));
            admin.setDepartment("IT Department");
            admin.setSecurityClearanceLevel("High");
            admin.setEmergencyAccessGrantor(true);
            
            userRepository.save(admin);
            
            // Return the admin info (except password)
            return ResponseEntity.ok(Map.of(
                "message", "Admin created successfully",
                "id", admin.getId(),
                "username", admin.getUsername(),
                "walletAddress", admin.getWalletAddress()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to create admin",
                "details", e.getMessage()
            ));
        }
    }
}*/