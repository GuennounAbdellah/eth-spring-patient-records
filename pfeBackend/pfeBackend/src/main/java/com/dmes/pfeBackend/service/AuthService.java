package com.dmes.pfeBackend.service;

import com.dmes.pfeBackend.dto.AuthResponse;
import com.dmes.pfeBackend.dto.LoginRequest;
import com.dmes.pfeBackend.dto.ProfileResponse;
import com.dmes.pfeBackend.dto.RegistrationRequest;
import com.dmes.pfeBackend.model.User;
import com.dmes.pfeBackend.repository.UserRepository;
import com.dmes.pfeBackend.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// This service handles authentication and registration of users.

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider; 
    private final UserRepository userRepository;

    public AuthService(AuthenticationManager authenticationManager, UserService userService, JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    public AuthResponse register(RegistrationRequest request) {
        User user = userService.registerUser(request);
        String token = jwtTokenProvider.generateToken(user.getUsername());
        
        // Get complete profile information
        ProfileResponse profile = userService.getUserProfile(user.getId());
        
        // Return token and profile in the response
        return new AuthResponse(token, profile);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + request.getUsername()));
        
        String token = jwtTokenProvider.generateToken(user.getUsername());
        
        // Get complete profile information
        ProfileResponse profile = userService.getUserProfile(user.getId());
        
        // Return token and profile in the response
        return new AuthResponse(token, profile);
    }
}