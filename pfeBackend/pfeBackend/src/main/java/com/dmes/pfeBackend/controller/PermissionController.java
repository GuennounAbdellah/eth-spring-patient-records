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
import java.util.Optional;

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
    public ResponseEntity<?> grantAccess(@RequestBody Map<String, Object> requestMap) {
        try {
            // Get currently authenticated user (patient)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User patient = userService.findByUsername(username);
            
            if (patient == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Current user not found"));
            }
            
            // Get doctor by username
            String doctorUsername = (String) requestMap.get("doctorUsername");
            User doctor = userService.findByUsername(doctorUsername);
            
            if (doctor == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found with username: " + doctorUsername));
            }
            
            // Create and populate the request
            AccessPermissionRequest request = new AccessPermissionRequest();
            request.setPatientId(patient.getId());
            request.setDoctorId(doctor.getId());
            
            if (requestMap.containsKey("expiresAt")) {
                request.setExpiresAt(Long.valueOf(requestMap.get("expiresAt").toString()));
            }
            
            permissionService.grantAccess(request).join(); // Wait for completion
            return ResponseEntity.ok(Map.of("message", "Access granted to Dr. " + doctorUsername));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/remove-access")
    public ResponseEntity<?> removeAccess(@RequestBody Map<String, Object> requestMap) {
        try {
            // Get currently authenticated user (patient)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User patient = userService.findByUsername(username);
            
            if (patient == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Current user not found"));
            }
            
            // Get doctor by username
            String doctorUsername = (String) requestMap.get("doctorUsername");
            User doctor = userService.findByUsername(doctorUsername);
            
            if (doctor == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found with username: " + doctorUsername));
            }
            
            // Create and populate the request with IDs
            AccessPermissionRequest request = new AccessPermissionRequest();
            request.setPatientId(patient.getId());
            request.setDoctorId(doctor.getId());
            
            // Call the service and wait for completion
            permissionService.removeAccess(request).join();
            
            return ResponseEntity.ok(Map.of("message", "Access removed for Dr. " + doctorUsername));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkPermission(@RequestParam String patientId) {
        try {
            // Get currently authenticated user (doctor)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User requester = userService.findByUsername(username);
            
            if (requester == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            // If user is accessing their own data, always permit
            if (requester.getId().equals(patientId)) {
                return ResponseEntity.ok(Map.of("hasPermission", true));
            }
            
            // Check if doctor has permission for this patient
            boolean hasPermission = permissionService.isPermitted(patientId, requester.getId()).join();
            
            return ResponseEntity.ok(Map.of("hasPermission", hasPermission));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/request-access")
    public ResponseEntity<?> requestAccess(@RequestBody Map<String, String> requestMap) {
        try {
            // Get currently authenticated user (doctor)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User doctor = userService.findByUsername(username);
            
            if (doctor == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found"));
            }
            
            // Get patient
            String patientId = requestMap.get("patientId");
            Optional<User> patientOpt = userService.findByUserId(patientId);
            
            if (patientOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Patient not found"));
            }
            
            // In a real application, you would send a notification to the patient
            // For this example, we just log and return success
            
            return ResponseEntity.ok(Map.of(
                "message", "Access request sent successfully",
                "doctorId", doctor.getId(),
                "patientId", patientId
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}