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
import java.util.concurrent.CompletableFuture;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {
    private static final Logger logger = Logger.getLogger(ConsultationController.class.getName());
    
    private final ConsultationService consultationService;
    private final UserService userService;

    public ConsultationController(ConsultationService consultationService, UserService userService) {
        this.consultationService = consultationService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> addConsultation(@RequestBody ConsultationRequest request) {
        try {
            // Get the authenticated doctor
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User doctor = userService.findByUsername(username);
            
            if (doctor == null) {
                logger.warning("Doctor not found with username: " + username);
                return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found"));
            }
            
            // Log attempt
            logger.info("Adding consultation for patient " + request.getPatientId() + " by doctor " + doctor.getId());
            
            // Call service and wait for completion
            String transactionHash = consultationService.addConsultation(request, doctor.getId()).join();
            
            return ResponseEntity.ok(Map.of(
                "message", "Consultation added successfully",
                "transactionHash", transactionHash
            ));
        } catch (Exception e) {
            logger.severe("Error adding consultation: " + e.getMessage());
            e.printStackTrace();  // Log the stack trace for debugging
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Error adding consultation",
                "details", e.getMessage()
            ));
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteConsultation(@RequestBody DeleteConsultationRequest request) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.findByUsername(username);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            // Call service and wait for completion
            String transactionHash = consultationService.deleteConsultation(request).join();
            
            return ResponseEntity.ok(Map.of(
                "message", "Consultation deleted successfully",
                "transactionHash", transactionHash
            ));
        } catch (Exception e) {
            logger.severe("Error deleting consultation: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Error deleting consultation",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping
    public ResponseEntity<?> getConsultations(@RequestParam String patientId) {
        try {
            logger.info("Fetching consultations for patient: " + patientId);
            
            // Get the authenticated doctor
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User doctor = userService.findByUsername(username);
            
            if (doctor == null) {
                logger.warning("Doctor not found with username: " + username);
                return ResponseEntity.badRequest().body(Map.of("error", "Doctor not found"));
            }
            
            // Call service with explicit type to avoid CompletableFuture issues
            CompletableFuture<List<Consultation>> futureResult = 
                consultationService.getPatientConsultations(patientId, doctor.getId());
                
            List<Consultation> consultations = futureResult.join();
            
            logger.info("Retrieved " + consultations.size() + " consultations for patient " + patientId);
            return ResponseEntity.ok(consultations);
        } catch (Exception e) {
            logger.severe("Error retrieving consultations: " + e.getMessage());
            e.printStackTrace();  // Log the stack trace for debugging
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
            
            logger.info("Retrieved " + consultations.size() + " consultations for self-access by patient " + patient.getId());
            return ResponseEntity.ok(consultations);
        } catch (Exception e) {
            logger.severe("Error retrieving patient consultations: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Error retrieving consultations", 
                "details", e.getMessage()
            ));
        }
    }
}