package com.dmes.pfeBackend.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class AdminService {

    private final ContractService contractService;

    public AdminService(ContractService contractService) {
        this.contractService = contractService;
    }

    public CompletableFuture<String> toggleEmergencyMode(boolean active) {
        return contractService.toggleEmergencyMode(active);
    }

    public CompletableFuture<String> setEmergencyAccessor(String address, boolean canAccess) {
        return contractService.setEmergencyAccessor(address, canAccess);
    }
    
    public CompletableFuture<Boolean> isEmergencyMode() {
        return CompletableFuture.supplyAsync(() -> {
            try {
                return contractService.isEmergencyMode();
            } catch (Exception e) {
                throw new RuntimeException("Failed to check emergency mode", e);
            }
        });
    }
}