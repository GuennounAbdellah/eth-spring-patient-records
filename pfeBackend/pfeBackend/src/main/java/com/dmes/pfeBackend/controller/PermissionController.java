package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.dto.AccessPermissionRequest;
import com.dmes.pfeBackend.model.User;
import com.dmes.pfeBackend.service.PermissionService;
import com.dmes.pfeBackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    private final PermissionService permissionService;
    private final UserService userService;

    public PermissionController(PermissionService permissionService, UserService userService) {
        this.permissionService = permissionService;
        this.userService = userService;
    }

    @PostMapping("/grant-access")
    public ResponseEntity<String> grantAccess(@RequestBody Map<String, Object> requestMap) {
        // Keep the same implementation
        try {
            // Get currently authenticated user (patient)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User patient = userService.findByUsername(username);
            
            if (patient == null) {
                return ResponseEntity.badRequest().body("Current user not found");
            }
            
            // Get doctor by username
            String doctorUsername = (String) requestMap.get("doctorUsername");
            User doctor = userService.findByUsername(doctorUsername);
            
            if (doctor == null) {
                return ResponseEntity.badRequest().body("Doctor not found with username: " + doctorUsername);
            }
            
            // Create and populate the request
            AccessPermissionRequest request = new AccessPermissionRequest();
            request.setPatientId(patient.getId());
            request.setDoctorId(doctor.getId());
            
            if (requestMap.containsKey("expiresAt")) {
                request.setExpiresAt(Long.valueOf(requestMap.get("expiresAt").toString()));
            }
            
            permissionService.grantAccess(request).join(); // Wait for completion
            return ResponseEntity.ok("Access granted to Dr. " + doctorUsername);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/remove-access")
    public ResponseEntity<String> removeAccess(@RequestBody Map<String, Object> requestMap) {
        try {
            // Get currently authenticated user (patient)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User patient = userService.findByUsername(username);
            
            if (patient == null) {
                return ResponseEntity.badRequest().body("Current user not found");
            }
            
            // Get doctor by username
            String doctorUsername = (String) requestMap.get("doctorUsername");
            User doctor = userService.findByUsername(doctorUsername);
            
            if (doctor == null) {
                return ResponseEntity.badRequest().body("Doctor not found with username: " + doctorUsername);
            }
            
            // Create and populate the request with IDs
            AccessPermissionRequest request = new AccessPermissionRequest();
            request.setPatientId(patient.getId());
            request.setDoctorId(doctor.getId());
            
            // Call the service and wait for completion
            permissionService.removeAccess(request).join();
            
            return ResponseEntity.ok("Access removed for Dr. " + doctorUsername);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}