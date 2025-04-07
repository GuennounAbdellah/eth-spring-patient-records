/*
 it's used to create the first admin in the database so we can delete it after the first run
 the setup key is used to make sure that the request is coming from the right source 
 because we don't want to expose the endpoint to the public
 
 POST /api/setup/admin
Content-Type: application/json

{
  "setupKey": "SETUP_SECRET_KEY",
  "username": "admin",
  "password": "Password123",
  "walletAddress": "0x43cB8645eCCA7A63A1333366b9E06b448CE0eBB2"
}

 */
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

/**
 * Controller for initial system setup.
 * Used to create the first admin in the database.
 * Should be protected and disabled in production.
 * 
 * Example POST request:
 * POST /api/setup/admin
 * Content-Type: application/json
 *
 * {
 *   "setupKey": "SETUP_SECRET_KEY",
 *   "username": "admin",
 *   "password": "Password123",
 *   "email": "admin@dmes.com",
 *   "walletAddress": "0x43cB8645eCCA7A63A1333366b9E06b448CE0eBB2"
 * }
 */

/*

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
            // Check if required fields are provided
            String username = request.get("username");
            String password = request.get("password");
            String email = request.get("email");
            
            if (username == null || password == null || email == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Missing required fields",
                    "details", "Username, password and email are required"
                ));
            }
            
            // Check if username or email already exists
            if (userRepository.existsByUsername(username)) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Username already exists"
                ));
            }
            
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Email already exists"
                ));
            }
            
            // Create admin with encoded password
            Admin admin = new Admin();
            admin.setId(UUID.randomUUID().toString());
            admin.setUsername(username);
            admin.setEmail(email); // Set the email field
            admin.setPasswordHash(passwordEncoder.encode(password));
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            admin.setWalletAddress(request.get("walletAddress"));
            admin.setDepartment(request.getOrDefault("department", "IT Department"));
            admin.setSecurityClearanceLevel(request.getOrDefault("securityClearanceLevel", "High"));
            admin.setEmergencyAccessGrantor(Boolean.parseBoolean(request.getOrDefault("emergencyAccessGrantor", "true")));
            
            userRepository.save(admin);
            
            // Return the admin info (except password)
            return ResponseEntity.ok(Map.of(
                "message", "Admin created successfully",
                "id", admin.getId(),
                "username", admin.getUsername(),
                "email", admin.getEmail(),
                "walletAddress", admin.getWalletAddress() != null ? admin.getWalletAddress() : ""
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to create admin",
                "details", e.getMessage()
            ));
        }
    }
}
*/