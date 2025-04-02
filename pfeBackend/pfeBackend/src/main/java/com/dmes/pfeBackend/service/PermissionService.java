package com.dmes.pfeBackend.service;

import com.dmes.pfeBackend.dto.AccessPermissionRequest;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.concurrent.CompletableFuture;


@Service
public class PermissionService {

    private final ContractService contractService;
    private final UserService userService;


    public PermissionService(ContractService contractService, UserService userService) {
        this.contractService = contractService;
        this.userService = userService;
    }

    public CompletableFuture<String> grantAccess(AccessPermissionRequest request) {
        // First validate that both users exist
        userService.findByUserId(request.getPatientId())
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        userService.findByUserId(request.getDoctorId())
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        // Then call contract service
        return contractService.grantAccess(
            request.getPatientId(),
            request.getDoctorId(),
            request.getExpiresAt() != null ? BigInteger.valueOf(request.getExpiresAt()) : BigInteger.ZERO
        );
    }

    public CompletableFuture<String> removeAccess(AccessPermissionRequest request) {
        return contractService.removeAccess(request.getPatientId(), request.getDoctorId());
    }

    public CompletableFuture<Boolean> isPermitted(String patientId, String requesterId) {
        return contractService.isPermitted(patientId, requesterId);
    }
}