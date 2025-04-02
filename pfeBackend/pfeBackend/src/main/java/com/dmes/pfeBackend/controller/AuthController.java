package com.dmes.pfeBackend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmes.pfeBackend.dto.AuthResponse;
import com.dmes.pfeBackend.dto.LoginRequest;
import com.dmes.pfeBackend.dto.ProfileResponse;
import com.dmes.pfeBackend.dto.RegistrationRequest;
import com.dmes.pfeBackend.dto.DoctorRegistrationRequest;
import com.dmes.pfeBackend.dto.PatientRegistrationRequest;
import com.dmes.pfeBackend.model.User;
import com.dmes.pfeBackend.security.JwtTokenProvider;
import com.dmes.pfeBackend.service.UserService;


@RestController
@RequestMapping("/api/auth")
public class AuthController {


    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtTokenProvider jwtTokenProvider,
            UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenProvider.generateToken(userDetails);
            
            User user = userService.findByUsername(userDetails.getUsername());
            ProfileResponse profile = userService.getUserProfile(user.getId());
            // Create AuthResponse with all required parameters
            AuthResponse authResponse = new AuthResponse(
                token,
                profile
            );
            
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid username or password", "details", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest registrationRequest) {
        try {
            User user = userService.registerUser(registrationRequest);
            return ResponseEntity.ok(Map.of("message", "User registered successfully", "userId", user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Registration failed", "details", e.getMessage()));
        }
    }

    @PostMapping("/register/doctor")
    public ResponseEntity<?> registerDoctor(@RequestBody DoctorRegistrationRequest request) {
        try {
            // Call a service method to register the doctor
            User doctor = userService.registerDoctor(request);
            return ResponseEntity.ok(Map.of(
                "message", "Doctor registered successfully",
                "userId", doctor.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Doctor registration failed",
                "details", e.getMessage()
            ));
        }
    }

    @PostMapping("/register/patient")
    public ResponseEntity<?> registerPatient(@RequestBody PatientRegistrationRequest request) {
        try {
            // Call a service method to register the patient
            User patient = userService.registerPatient(request);
            return ResponseEntity.ok(Map.of(
                "message", "Patient registered successfully",
                "userId", patient.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Patient registration failed",
                "details", e.getMessage()
            ));
        }
    }


}