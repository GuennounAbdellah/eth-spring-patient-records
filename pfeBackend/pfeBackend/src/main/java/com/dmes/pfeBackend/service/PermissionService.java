package com.dmes.pfeBackend.service;

import com.dmes.pfeBackend.dto.AccessPermissionRequest;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.concurrent.CompletableFuture;

@Service
public class PermissionService {

    private final ContractService contractService;

    public PermissionService(ContractService contractService) {
        this.contractService = contractService;
    }

    public CompletableFuture<String> grantAccess(AccessPermissionRequest request) {
        // Convert Long to BigInteger
        BigInteger expiresAt = (request.getExpiresAt() != null) 
            ? BigInteger.valueOf(request.getExpiresAt())
            : BigInteger.ZERO;
                
        return contractService.grantAccess(
                request.getPatientId(),
                request.getDoctorId(),
                expiresAt
        );
    }

    public CompletableFuture<String> removeAccess(AccessPermissionRequest request) {
        return contractService.removeAccess(request.getPatientId(), request.getDoctorId());
    }

    public CompletableFuture<Boolean> isPermitted(String patientId, String requesterId) {
        return contractService.isPermitted(patientId, requesterId);
    }
}