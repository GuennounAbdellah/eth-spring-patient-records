package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.dto.ConsultationRequest;
import com.dmes.pfeBackend.dto.DeleteConsultationRequest;
import com.dmes.pfeBackend.model.Consultation;
import com.dmes.pfeBackend.model.User;
import com.dmes.pfeBackend.service.ConsultationService;
import com.dmes.pfeBackend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;
    private final UserService userService;

    public ConsultationController(ConsultationService consultationService, UserService userService) {
        this.consultationService = consultationService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<String> addConsultation(@RequestBody ConsultationRequest request) {
        try {
            // Get the authenticated doctor
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User doctor = userService.findByUsername(username);
            
            if (doctor == null) {
                return ResponseEntity.badRequest().body("Doctor not found");
            }
            
            // Call service and wait for completion
            consultationService.addConsultation(request, doctor.getId()).join();
            return ResponseEntity.ok("Consultation added successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding consultation: " + e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<String> deleteConsultation(@RequestBody DeleteConsultationRequest request) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.findByUsername(username);
            
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            // Call service and wait for completion
            consultationService.deleteConsultation(request).join();
            return ResponseEntity.ok("Consultation deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting consultation: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getConsultations(@RequestParam String patientId) {
        try {
            // Get the authenticated doctor
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User doctor = userService.findByUsername(username);
            
            if (doctor == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found"));
            }
            
            // Call service
            List<Consultation> consultations = consultationService
                .getPatientConsultations(patientId, doctor.getId())
                .join();
                
            return ResponseEntity.ok(consultations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Error retrieving consultations", 
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/patient")
    public ResponseEntity<?> getPatientConsultations() {
        try {
            // Get the authenticated patient
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User patient = userService.findByUsername(username);
            
            if (patient == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Patient not found"));
            }
            
            // Patient can see their own consultations
            List<Consultation> consultations = consultationService
                .getPatientConsultations(patient.getId(), patient.getId())
                .join();
                
            return ResponseEntity.ok(consultations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Error retrieving consultations", 
                "details", e.getMessage()
            ));
        }
    }
}