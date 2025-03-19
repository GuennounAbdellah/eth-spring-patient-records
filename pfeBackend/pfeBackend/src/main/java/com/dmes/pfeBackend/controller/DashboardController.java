package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.dto.DoctorPatientsDTO;
import com.dmes.pfeBackend.dto.PatientDoctorsDTO;
import com.dmes.pfeBackend.model.Consultation;
import com.dmes.pfeBackend.model.Doctor;
import com.dmes.pfeBackend.model.Patient;
import com.dmes.pfeBackend.model.User;
import com.dmes.pfeBackend.security.CurrentUser;
import com.dmes.pfeBackend.service.ConsultationService;
import com.dmes.pfeBackend.service.ContractService;
import com.dmes.pfeBackend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ContractService contractService;
    private final UserService userService;
    private final ConsultationService consultationService;

    public DashboardController(ContractService contractService, 
                             UserService userService,
                             ConsultationService consultationService) {
        this.contractService = contractService;
        this.userService = userService;
        this.consultationService = consultationService;
    }

    /**
     * Get all doctors that have access to the patient's records
     */
    @GetMapping("/patient/doctors")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<PatientDoctorsDTO>> getPatientDoctors(@CurrentUser User patient) {
        try {
            // Get all doctor IDs that have access to this patient
            List<String> doctorIds = contractService.getPatientDoctors(patient.getId());
            
            // Convert doctor IDs to user objects with basic info
            List<PatientDoctorsDTO> doctors = doctorIds.stream()
                .map(doctorId -> {
                    Optional<Doctor> doctor = userService.findDoctorByUserId(doctorId);
                    return doctor.map(d -> new PatientDoctorsDTO(
                        d.getId(), 
                        d.getUsername(), 
                        d.getWalletAddress(),
                        d.getSpecialization(),
                        d.getHospitalAffiliation()
                    )).orElse(null);
                })
                .filter(d -> d != null)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all patients that the doctor has access to
     */
    @GetMapping("/doctor/patients")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<DoctorPatientsDTO>> getDoctorPatients(@CurrentUser User doctor) {
        try {
            // Get all patient IDs that this doctor has access to
            List<String> patientIds = contractService.getDoctorPatients(doctor.getId());
            
            // Convert patient IDs to user objects with basic info
            List<DoctorPatientsDTO> patients = patientIds.stream()
                .map(patientId -> {
                    Optional<Patient> patient = userService.findPatientByUserId(patientId);
                    return patient.map(p -> new DoctorPatientsDTO(
                        p.getId(), 
                        p.getUsername(), 
                        p.getWalletAddress(),
                        p.getBloodGroup()
                    )).orElse(null);
                })
                .filter(p -> p != null)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get consultations for a specific patient (for doctor's view)
     */
    @GetMapping("/doctor/patient/{patientId}/consultations")
    @PreAuthorize("hasRole('DOCTOR')")
    public CompletableFuture<ResponseEntity<List<Consultation>>> getPatientConsultationsForDoctor(
            @PathVariable String patientId,
            @CurrentUser User doctor
    ) {
        return consultationService.getPatientConsultations(patientId, doctor.getId())
                .thenApply(ResponseEntity::ok)
                .exceptionally(e -> ResponseEntity.internalServerError().build());
    }
}