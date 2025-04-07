package com.dmes.pfeBackend.service;

import com.dmes.pfeBackend.contract.HospitalConsultation;
import com.dmes.pfeBackend.model.Consultation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.gas.ContractGasProvider;

import jakarta.annotation.PostConstruct;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;

// It uses Web3j to communicate with the Ethereum blockchain
@Service
public class ContractService {

    private final Web3j web3j;
    private final Credentials credentials;
    private final ContractGasProvider gasProvider;
    private final String contractAddress;
    
    private HospitalConsultation contract;

    @Autowired
    public ContractService(
            Web3j web3j, 
            Credentials credentials, 
            ContractGasProvider gasProvider,
            String contractAddress) {
        this.web3j = web3j;
        this.credentials = credentials;
        this.gasProvider = gasProvider;
        this.contractAddress = contractAddress;
    }

    @PostConstruct
    public void init() {
        // Initialize contract if address is provided
        if (contractAddress != null && !contractAddress.isEmpty()) {
            try {
                this.contract = HospitalConsultation.load(
                    contractAddress,
                    web3j,
                    credentials,
                    gasProvider
                );
                
                // Optionally validate contract is deployed
                boolean isValid = contract.isValid();
                if (!isValid) {
                    System.err.println("!!!!!!Warning: Contract at address " + contractAddress + " does not appear to be valid!!!!!!!!");
                }
            } catch (Exception e) {
                // Log error but don't fail startup
                System.err.println("Failed to load contract: " + e.getMessage());
            }
        }
    }
   
    // Helper method for async contract operations
    private <T> CompletableFuture<T> executeContractOperation(
    		Function<HospitalConsultation, CompletableFuture<T>> operation)
    {
    	
        if (contract == null) {
            return CompletableFuture.failedFuture(new IllegalStateException("Contract not initialized"));
        }
        try {
            return operation.apply(contract);
        } catch (Exception e) {
            return CompletableFuture.failedFuture(
                new RuntimeException("Contract operation failed: " + e.getMessage(), e));
        }
    }
    
    // Helper method for synchronous contract operations
    private <T> T executeContractOperationSync(Supplier<T> operation) {
        if (contract == null) {
            throw new IllegalStateException("Contract not initialized");
        }
        try {
            return operation.get();
        } catch (Exception e) {
            throw new RuntimeException("Contract operation failed: " + e.getMessage(), e);
        }
    }
    
    // User management functions
    public CompletableFuture<Void> registerUser(String userId, String walletAddress, boolean isDoctor, boolean isAdmin) {
        return executeContractOperation(contract -> 
            contract.registerUser(userId, walletAddress, isDoctor, isAdmin)
                .sendAsync()
                .thenApply(tx -> null)
        );
    }

    public CompletableFuture<String> setUserStatus(String userId, boolean isActive) {
        return executeContractOperation(contract -> 
            contract.setUserStatus(userId, isActive)
                .sendAsync()
                .thenApply(TransactionReceipt::getTransactionHash)
        );
    }
    
    // Consultation functions
    public CompletableFuture<String> addConsultation(String patientId, String details, String metadata) {
        return executeContractOperation(contract -> 
            contract.addConsultation(patientId, details, metadata)
                .sendAsync()
                .thenApply(TransactionReceipt::getTransactionHash)
        );
    }
    
    public CompletableFuture<String> deleteConsultation(String patientId, BigInteger timestamp) {
        return executeContractOperation(contract -> 
            contract.deleteConsultation(patientId, timestamp)
                .sendAsync()
                .thenApply(TransactionReceipt::getTransactionHash)
        );
    }
    
    //Upon calling that function from the smart contract, the transaction status displays 'Pending'.
    @SuppressWarnings("unchecked")
    public CompletableFuture<List<Consultation>> getPatientConsultations(String patientId, String requesterId) {
        return executeContractOperation(contract -> 
            CompletableFuture.supplyAsync(() -> {
                try {
                    // Check permission first
                    boolean hasPermission = contract.isPermitted(patientId, requesterId).send();
                    if (!hasPermission && !patientId.equals(requesterId) && !isEmergencyMode()) {
                        throw new RuntimeException("Requester does not have permission to access patient consultations");
                    }
                    
                    // Get raw consultations from the contract
                    List<HospitalConsultation.Consultation> rawConsultations = 
                        contract.getPatientConsultations(patientId, requesterId).send();
                    
                    if (rawConsultations == null) {
                        return new ArrayList<Consultation>();
                    }
                    
                    // Transform to our domain model
                    return rawConsultations.stream()
                        .map(raw -> new Consultation(
                            raw.patientId,
                            raw.doctorId,
                            raw.details,
                            raw.metadata,
                            raw.timestamp.longValue(),
                            raw.isDeleted
                        ))
                        .filter(c -> !c.isDeleted()) // Filter out deleted consultations
                        .collect(Collectors.toList());
                } catch (Exception e) {
                    throw new RuntimeException("Error getting patient consultations: " + e.getMessage(), e);
                }
            })
        );
    }
    
    // Permission management
    public CompletableFuture<Boolean> isPermitted(String patientId, String requesterId) {
        return executeContractOperation(contract -> 
            contract.isPermitted(patientId, requesterId).sendAsync()
        );
    }
    
    public CompletableFuture<String> grantAccess(String patientId, String doctorId, BigInteger expiresAt) {
        return executeContractOperation(contract -> 
            contract.grantAccess(patientId, doctorId, expiresAt)
                .sendAsync()
                .thenApply(TransactionReceipt::getTransactionHash)
        );
    }
    
    public CompletableFuture<String> removeAccess(String patientId, String doctorId) {
        return executeContractOperation(contract -> 
            contract.removeAccess(patientId, doctorId)
                .sendAsync()
                .thenApply(TransactionReceipt::getTransactionHash)
        );
    }
    
    public List<String> getDoctorPatients(String doctorId) {
        return executeContractOperationSync(() -> {
            try {
                @SuppressWarnings("unchecked") //Java can't guarantee the type inside the returned List at compile time
                List<String> patients = (List<String>) contract.getDoctorPatients(doctorId).send();
                return patients;
            } catch (Exception e) {
                throw new RuntimeException("Failed to get doctor patients: " + e.getMessage(), e);
            }
        });
    }

    public List<String> getPatientDoctors(String patientId) {
        return executeContractOperationSync(() -> {
            try {
                @SuppressWarnings("unchecked") 
                List<String> doctors = (List<String>) contract.getPatientDoctors(patientId).send();
                return doctors;
            } catch (Exception e) {
                throw new RuntimeException("Failed to get patient doctors: " + e.getMessage(), e);
            }
        });
    }
    
    // Emergency functions
    public CompletableFuture<String> toggleEmergencyMode(boolean active) {
        return executeContractOperation(contract -> 
            contract.toggleEmergencyMode(active)
                .sendAsync()
                .thenApply(TransactionReceipt::getTransactionHash)
        );
    }
    
    public CompletableFuture<String> setEmergencyAccessor(String accessor, boolean canAccess) {
        return executeContractOperation(contract -> 
            contract.setEmergencyAccessor(accessor, canAccess)
                .sendAsync()
                .thenApply(TransactionReceipt::getTransactionHash)
        );
    }
    
    public boolean isEmergencyMode() {
        return executeContractOperationSync(() -> {
            try {
                return contract.emergencyMode().send();
            } catch (Exception e) {
                throw new RuntimeException("Failed to check emergency mode: " + e.getMessage(), e);
            }
        });
    }
    public String getContractAddress() {
        return contractAddress;
    }
}