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
            } catch (Exception e) {
                // Log error but don't fail startup
                System.err.println("Failed to load contract: " + e.getMessage());
            }
        }
    }
    //100%
    public CompletableFuture<Void> registerUser(String userId, String walletAddress, boolean isDoctor, boolean isAdmin) {
    	if (contract == null) {
    	    return CompletableFuture.failedFuture(new IllegalStateException("Contract not initialized"));
    	}
        
        return contract.registerUser(userId, walletAddress, isDoctor, isAdmin)
            .sendAsync()
            .thenApply(tx -> null);
    }

    public CompletableFuture<String> setUserStatus(String userId, boolean isActive) {
    	if (contract == null) {
    	    return CompletableFuture.failedFuture(new IllegalStateException("Contract not initialized"));
    	}
        try {
            return contract.setUserStatus(userId, isActive).sendAsync()
                .thenApply(TransactionReceipt::getTransactionHash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to set user status: " + e.getMessage(), e);
        }
    }
    
    // Consultation functions
    public CompletableFuture<String> addConsultation(String patientId, String details, String metadata) {
    	if (contract == null) {
    	    return CompletableFuture.failedFuture(new IllegalStateException("Contract not initialized"));
    	}
        try {
            return contract.addConsultation(patientId, details, metadata).sendAsync()
                .thenApply(TransactionReceipt::getTransactionHash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to add consultation: " + e.getMessage(), e);
        }
    }
    
    public CompletableFuture<String> deleteConsultation(String patientId, BigInteger timestamp) {
    	if (contract == null) {
    	    return CompletableFuture.failedFuture(new IllegalStateException("Contract not initialized"));
    	}
        try {
            return contract.deleteConsultation(patientId, timestamp).sendAsync()
                .thenApply(TransactionReceipt::getTransactionHash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete consultation: " + e.getMessage(), e);
        }
    }
    
    //I still have some problemes in the smart contract in this function may pend it demand time
    @SuppressWarnings("unchecked") 
    public CompletableFuture<List<Consultation>> getPatientConsultations(String patientId, String requesterId) {
    	if (contract == null) {
    	    return CompletableFuture.failedFuture(new IllegalStateException("Contract not initialized"));
    	}
        return CompletableFuture.supplyAsync(() -> {
            try {
                // This suppresses the unchecked conversion warning
                List<Object> result = contract.getPatientConsultations(patientId, requesterId).send();
                
                // Safer approach with explicit type checking
                if (result.size() < 6) {
                    throw new RuntimeException("Unexpected result format from contract");
                }
                
                Object item0 = result.get(0);
                Object item1 = result.get(1);
                Object item2 = result.get(2);
                Object item3 = result.get(3);
                Object item4 = result.get(4);
                Object item5 = result.get(5);
                
                if (!(item0 instanceof List) || !(item1 instanceof List) || !(item2 instanceof List) || 
                    !(item3 instanceof List) || !(item4 instanceof List) || !(item5 instanceof List)) {
                    throw new RuntimeException("Unexpected result format from contract");
                }
                
                List<String> patientIds = (List<String>) item0;
                List<String> doctorIds = (List<String>) item1;
                List<String> details = (List<String>) item2;
                List<String> metadatas = (List<String>) item3;
                List<BigInteger> timestamps = (List<BigInteger>) item4;
                List<Boolean> isDeletedList = (List<Boolean>) item5;
                
                // Rest of the processing remains the same
                List<Consultation> consultations = new ArrayList<>();
                for (int i = 0; i < patientIds.size(); i++) {
                    Consultation consultation = new Consultation();
                    consultation.setPatientId(patientIds.get(i));
                    consultation.setDoctorId(doctorIds.get(i));
                    consultation.setDetails(details.get(i));
                    consultation.setMetadata(metadatas.get(i));
                    consultation.setTimestamp(timestamps.get(i).longValue());
                    consultation.setDeleted(isDeletedList.get(i));
                    consultations.add(consultation);
                }
                
                return consultations;
            } catch (Exception e) {
                throw new RuntimeException("Failed to get patient consultations: " + e.getMessage(), e);
            }
        });
    }
    
    // Permission management
    public CompletableFuture<Boolean> isPermitted(String patientId, String requesterId) {
        if (contract == null) {
            return CompletableFuture.failedFuture(new IllegalStateException("Contract not initialized"));
        }
        try {
            return contract.isPermitted(patientId, requesterId).sendAsync();
        } catch (Exception e) {
            throw new RuntimeException("Failed to check permission: " + e.getMessage(), e);
        }
    }
    
    public CompletableFuture<String> grantAccess(String patientId, String doctorId, BigInteger expiresAt) {
        if (contract == null) {
            return CompletableFuture.failedFuture(new IllegalStateException("Contract not initialized"));
        }
        try {
            return contract.grantAccess(patientId, doctorId, expiresAt).sendAsync()
                .thenApply(TransactionReceipt::getTransactionHash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to grant access: " + e.getMessage(), e);
        }
    }
    
    public CompletableFuture<String> removeAccess(String patientId, String doctorId) {
        if (contract == null) {
            return CompletableFuture.failedFuture(new IllegalStateException("Contract not initialized"));
        }
        try {
            return contract.removeAccess(patientId, doctorId).sendAsync()
                .thenApply(TransactionReceipt::getTransactionHash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to remove access: " + e.getMessage(), e);
        }
    }
    
    @SuppressWarnings("unchecked")
    public List<String> getDoctorPatients(String doctorId) {
    	if (contract == null) {
    	    return (List<String>) CompletableFuture.failedFuture(new IllegalStateException("Contract not initialized"));
    	}
        try {
            // Add the @SuppressWarnings annotation to address the warning
            return contract.getDoctorPatients(doctorId).send();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get doctor patients: " + e.getMessage(), e);
        }
    }
    
    
    @SuppressWarnings("unchecked")
    public List<String> getPatientDoctors(String patientId) {
        if (contract == null) {
            return (List<String>) CompletableFuture.failedFuture(new IllegalStateException("Contract not initialized"));
        }
        try {
            return contract.getPatientDoctors(patientId).send();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get patient doctors: " + e.getMessage(), e);
        }
    }
    
    // Emergency functions
    public CompletableFuture<String> toggleEmergencyMode(boolean active) {
        if (contract == null) {
            return CompletableFuture.failedFuture(new IllegalStateException("Contract not initialized"));
        }
        try {
            return contract.toggleEmergencyMode(active).sendAsync()
                .thenApply(TransactionReceipt::getTransactionHash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to toggle emergency mode: " + e.getMessage(), e);
        }
    }
    
    public CompletableFuture<String> setEmergencyAccessor(String accessor, boolean canAccess) {
        if (contract == null) {
            return CompletableFuture.failedFuture(new IllegalStateException("Contract not initialized"));
        }
        try {
            return contract.setEmergencyAccessor(accessor, canAccess).sendAsync()
                .thenApply(TransactionReceipt::getTransactionHash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to set emergency accessor: " + e.getMessage(), e);
        }
    }
    
    public boolean isEmergencyMode() throws Exception {
        if (contract == null) {
            return CompletableFuture.failedFuture(new IllegalStateException("Contract not initialized")) != null;
        }
        return contract.emergencyMode().send();
    }
}