package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.dto.UserStatusUpdateRequest;
import com.dmes.pfeBackend.model.Doctor;
import com.dmes.pfeBackend.model.User;
import com.dmes.pfeBackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> getAllDoctors() {
        try {
            // Get all users with doctor role
            List<Doctor> doctors = userService.findAllDoctors();
            
            // Convert to DTOs with only necessary information
            List<Map<String, Object>> doctorList = doctors.stream()
                .map(d -> Map.of(
                    "id", (Object) d.getId(),
                    "username", (Object) d.getUsername(),
                    "specialization", (Object) (d.getSpecialization() != null ? d.getSpecialization() : ""),
                    "hospitalAffiliation", (Object) (d.getHospitalAffiliation() != null ? d.getHospitalAffiliation() : "")
                ))
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(doctorList);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/status")
    public ResponseEntity<User> updateUserStatus(
            @Valid @RequestBody UserStatusUpdateRequest request
    ) {
        User user = userService.updateUserStatus(request);
        return ResponseEntity.ok(user);
    }
}