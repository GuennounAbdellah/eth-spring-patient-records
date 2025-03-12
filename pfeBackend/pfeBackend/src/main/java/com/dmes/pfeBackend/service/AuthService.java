package com.dmes.pfeBackend.service;

import com.dmes.pfeBackend.dto.AuthResponse;
import com.dmes.pfeBackend.dto.LoginRequest;
import com.dmes.pfeBackend.dto.RegistrationRequest;
import com.dmes.pfeBackend.model.User;
import com.dmes.pfeBackend.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(AuthenticationManager authenticationManager, UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse register(RegistrationRequest request) {
        User user = userService.registerUser(request);
        String token = jwtTokenProvider.generateToken(user.getUsername());
        
        return new AuthResponse(token, user.getUserId(), user.getUsername(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        User user = userService.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = jwtTokenProvider.generateToken(user.getUsername());
        
        return new AuthResponse(token, user.getUserId(), user.getUsername(), user.getRole().name());
    }
}
