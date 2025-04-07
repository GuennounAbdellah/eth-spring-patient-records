package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.dto.PatientDetailsDTO;
import com.dmes.pfeBackend.model.Patient;
import com.dmes.pfeBackend.model.User;
import com.dmes.pfeBackend.service.PermissionService;
import com.dmes.pfeBackend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final UserService userService;
    private final PermissionService permissionService;

    public PatientController(UserService userService, PermissionService permissionService) {
        this.userService = userService;
        this.permissionService = permissionService;
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<?> getPatientById(@PathVariable String patientId) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User requester = userService.findByUsername(username);
            
            if (requester == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            // Find the patient
            Optional<Patient> patientOpt = userService.findPatientById(patientId);
            if (patientOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Patient patient = patientOpt.get();
            
            // Check if requester is same as patient or has permission
            boolean isSelf = requester.getId().equals(patientId);
            boolean hasPermission = isSelf || 
                permissionService.isPermitted(patientId, requester.getId()).join();
            
            if (!hasPermission) {
                return ResponseEntity.status(403).body(Map.of(
                    "error", "Access denied. You do not have permission to access this patient's information."
                ));
            }
            
            // Create response map with patient details
            Map<String, Object> patientData = new HashMap<>();
            patientData.put("id", patient.getId());
            patientData.put("fullName", patient.getUsername());
            patientData.put("username", patient.getUsername());
            patientData.put("walletAddress", patient.getWalletAddress() != null ? patient.getWalletAddress() : "");
            patientData.put("dateOfBirth", patient.getDateOfBirth() != null ? patient.getDateOfBirth().toString() : "");
            patientData.put("bloodGroup", patient.getBloodGroup() != null ? patient.getBloodGroup() : "");
            patientData.put("medicalRecordNumber", patient.getMedicalRecordNumber() != null ? patient.getMedicalRecordNumber() : "");
            patientData.put("allergies", patient.getAllergies() != null ? patient.getAllergies() : "");
            patientData.put("chronicConditions", patient.getChronicConditions() != null ? patient.getChronicConditions() : "");
            patientData.put("emergencyContact", patient.getEmergencyContact() != null ? patient.getEmergencyContact() : "");
            
            return ResponseEntity.ok(patientData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Add any other patient-related endpoints here
}