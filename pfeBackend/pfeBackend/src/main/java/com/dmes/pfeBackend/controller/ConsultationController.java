package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.dto.ConsultationRequest;
import com.dmes.pfeBackend.dto.DeleteConsultationRequest;
import com.dmes.pfeBackend.model.Consultation;
import com.dmes.pfeBackend.model.User;
import com.dmes.pfeBackend.security.CurrentUser;
import com.dmes.pfeBackend.service.ConsultationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;

    public ConsultationController(ConsultationService consultationService) {
        this.consultationService = consultationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public CompletableFuture<ResponseEntity<String>> addConsultation(
            @RequestBody ConsultationRequest request,
            @CurrentUser User doctor
    ) {
        return consultationService.addConsultation(request, doctor.getId())
                .thenApply(ResponseEntity::ok);
    }

    @DeleteMapping
    public CompletableFuture<ResponseEntity<String>> deleteConsultation(
            @RequestBody DeleteConsultationRequest request
    ) {
        return consultationService.deleteConsultation(request)
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping
    public CompletableFuture<ResponseEntity<List<Consultation>>> getConsultations(
            @RequestParam String patientId,
            @RequestParam String requesterId
    ) {
        return consultationService.getPatientConsultations(patientId, requesterId)
                .thenApply(ResponseEntity::ok);
    }

    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public CompletableFuture<ResponseEntity<List<Consultation>>> getPatientConsultations(
            @CurrentUser User patient
    ) {
        // Patient can see their own consultations
        return consultationService.getPatientConsultations(patient.getId(), patient.getId())
                .thenApply(ResponseEntity::ok);
    }
}