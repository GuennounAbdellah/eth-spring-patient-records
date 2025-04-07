package com.dmes.pfeBackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dmes.pfeBackend.service.ContractService;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.Web3ClientVersion;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    private final Web3j web3j;
    private final ContractService contractService;

    public TestController(Web3j web3j, ContractService contractService) {
        this.web3j = web3j;
        this.contractService = contractService;
    }

    @GetMapping("/blockchain")
    public ResponseEntity<?> testBlockchainConnection() {
        try {
            Web3ClientVersion clientVersion = web3j.web3ClientVersion().send();
            return ResponseEntity.ok(Map.of(
                "status", "connected",
                "clientVersion", clientVersion.getWeb3ClientVersion()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", "Failed to connect to blockchain: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/contract")
    public ResponseEntity<?> testContractConnection() {
        try {
            boolean isEmergencyMode = contractService.isEmergencyMode();
            return ResponseEntity.ok(Map.of(
                "status", "connected",
                "contractAddress", contractService.getContractAddress(),
                "emergencyMode", isEmergencyMode
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", "Failed to connect to contract: " + e.getMessage()
            ));
        }
    }
}