package com.dmes.pfeBackend.service;

import com.healthcare.blockchain.dto.AccessPermissionRequest;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class PermissionService {

    private final ContractService contractService;

    public PermissionService(ContractService contractService) {
        this.contractService = contractService;
    }

    public CompletableFuture<String> grantAccess(AccessPermissionRequest request) {
        return contractService.grantAccess(
                request.getPatientId(),
                request.getDoctorId(),
                request.getExpiresAt() != null ? request.getExpiresAt() : 0L
        );
    }

    public CompletableFuture<String> removeAccess(AccessPermissionRequest request) {
        return contractService.removeAccess(request.getPatientId(), request.getDoctorId());
    }

    public CompletableFuture<Boolean> isPermitted(String patientId, String requesterId) {
        return contractService.isPermitted(patientId, requesterId);
    }
}