package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.dto.ProfileResponse;
import com.dmes.pfeBackend.dto.ProfileUpdateRequest;
import com.dmes.pfeBackend.model.Admin;
import com.dmes.pfeBackend.model.Doctor;
import com.dmes.pfeBackend.model.Patient;
import com.dmes.pfeBackend.model.Role;
import com.dmes.pfeBackend.model.User;
import com.dmes.pfeBackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;
    
    public ProfileController(UserService userService) {
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
    
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        
        try {
            // Update user based on role
            if (user.getRole() == Role.PATIENT) {
                Patient patientUpdate = new Patient();
                patientUpdate.setEmail(request.getEmail());
                patientUpdate.setWalletAddress(request.getWalletAddress());
                patientUpdate.setDateOfBirth(request.getDateOfBirth());
                patientUpdate.setBloodGroup(request.getBloodGroup());
                patientUpdate.setAllergies(request.getAllergies());
                patientUpdate.setChronicConditions(request.getChronicConditions());
                patientUpdate.setEmergencyContact(request.getEmergencyContact());
                
                userService.updatePatientProfile(user.getId(), patientUpdate);
            } 
            else if (user.getRole() == Role.DOCTOR) {
                Doctor doctorUpdate = new Doctor();
                doctorUpdate.setEmail(request.getEmail());
                doctorUpdate.setWalletAddress(request.getWalletAddress());
                doctorUpdate.setSpecialization(request.getSpecialization());
                doctorUpdate.setHospitalAffiliation(request.getHospitalAffiliation());
                doctorUpdate.setProfessionalBio(request.getProfessionalBio());
                doctorUpdate.setOfficeHours(request.getOfficeHours());
                
                userService.updateDoctorProfile(user.getId(), doctorUpdate);
            } 
            else if (user.getRole() == Role.ADMIN) {
                Admin adminUpdate = new Admin();
                adminUpdate.setEmail(request.getEmail());
                adminUpdate.setWalletAddress(request.getWalletAddress());
                adminUpdate.setDepartment(request.getDepartment());
                adminUpdate.setSecurityClearanceLevel(request.getSecurityClearanceLevel());
                adminUpdate.setEmergencyAccessGrantor(request.getEmergencyAccessGrantor());
                
                userService.updateAdminProfile(user.getId(), adminUpdate);
            }
            
            // Return updated profile
            ProfileResponse updatedProfile = userService.getUserProfile(user.getId());
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Error updating profile",
                "message", e.getMessage()
            ));
        }
    }
}