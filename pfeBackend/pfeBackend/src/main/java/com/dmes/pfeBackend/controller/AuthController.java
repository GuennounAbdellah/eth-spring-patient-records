package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.dto.AuthResponse;
import com.dmes.pfeBackend.dto.LoginRequest;
import com.dmes.pfeBackend.dto.RegistrationRequest;
import com.dmes.pfeBackend.model.User;
import com.dmes.pfeBackend.security.JwtTokenProvider;
import com.dmes.pfeBackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

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
            
            // Get the user from the UserDetails to access more information
            User user = userService.findByUsername(userDetails.getUsername());
            
            // Create AuthResponse with all required parameters
            AuthResponse authResponse = new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getRole().toString()
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
}