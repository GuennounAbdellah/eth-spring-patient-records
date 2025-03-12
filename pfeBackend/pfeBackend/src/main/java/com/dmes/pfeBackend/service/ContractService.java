package com.dmes.pfeBackend.service;

import com.dmes.pfeBackend.contract.HealthRecordContract;
import com.dmes.pfeBackend.model.Consultation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.tx.gas.ContractGasProvider;

import java.math.BigInteger;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class ContractService {

    private final Web3j web3j;
    private final ContractGasProvider gasProvider;
    private final HealthRecordContract contract;

    public ContractService(
            Web3j web3j,
            ContractGasProvider gasProvider,
            @Value("${ethereum.contract.address}") String contractAddress,
            @Value("${ethereum.wallet.private-key}") String privateKey) {
        this.web3j = web3j;
        this.gasProvider = gasProvider;
        Credentials credentials = Credentials.create(privateKey);
        this.contract = new HealthRecordContract(contractAddress, web3j, credentials, gasProvider);
    }

    public CompletableFuture<String> registerUser(String userId, String walletAddress) {
        return contract.registerUser(userId, walletAddress)
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash())
                .exceptionally(ex -> {
                    throw new RuntimeException("Failed to register user on blockchain", ex);
                });
    }

    public CompletableFuture<String> setUserStatus(String userId, boolean isActive) {
        return contract.setUserStatus(userId, isActive)
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash())
                .exceptionally(ex -> {
                    throw new RuntimeException("Failed to update user status on blockchain", ex);
                });
    }

    public CompletableFuture<String> addConsultation(String patientId, String details, String metadata) {
        return contract.addConsultation(patientId, details, metadata)
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash())
                .exceptionally(ex -> {
                    throw new RuntimeException("Failed to add consultation on blockchain", ex);
                });
    }

    public CompletableFuture<String> deleteConsultation(String patientId, Long timestamp) {
        return contract.deleteConsultation(patientId, BigInteger.valueOf(timestamp))
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash())
                .exceptionally(ex -> {
                    throw new RuntimeException("Failed to delete consultation on blockchain", ex);
                });
    }

    public CompletableFuture<List<Consultation>> getPatientConsultations(String patientId, String requesterId) {
        return contract.getPatientConsultations(patientId, requesterId)
                .sendAsync()
                .thenApply(this::mapToConsultations)
                .exceptionally(ex -> {
                    throw new RuntimeException("Failed to fetch consultations from blockchain", ex);
                });
    }

    private List<Consultation> mapToConsultations(List<?> rawConsultations) {
        return rawConsultations.stream()
                .map(this::mapToConsultation)
                .collect(Collectors.toList());
    }

    private Consultation mapToConsultation(Object rawConsultation) {
        // Assuming rawConsultation is a DynamicStruct or similar Web3j type
        // Map its fields to the Consultation class
        Consultation consultation = new Consultation();
        consultation.setPatientId((String) rawConsultation.get("patientId"));
        consultation.setDetails((String) rawConsultation.get("details"));
        consultation.setMetadata((String) rawConsultation.get("metadata"));
        consultation.setTimestamp((Long) rawConsultation.get("timestamp"));
        return consultation;
    }

    public CompletableFuture<String> grantAccess(String patientId, String doctorId, Long expiresAt) {
        return contract.grantAccess(patientId, doctorId, BigInteger.valueOf(expiresAt))
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash())
                .exceptionally(ex -> {
                    throw new RuntimeException("Failed to grant access on blockchain", ex);
                });
    }

    public CompletableFuture<String> removeAccess(String patientId, String doctorId) {
        return contract.removeAccess(patientId, doctorId)
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash())
                .exceptionally(ex -> {
                    throw new RuntimeException("Failed to remove access on blockchain", ex);
                });
    }

    public CompletableFuture<Boolean> isPermitted(String patientId, String requesterId) {
        return contract.isPermitted(patientId, requesterId)
                .sendAsync()
                .exceptionally(ex -> {
                    throw new RuntimeException("Failed to check permissions on blockchain", ex);
                });
    }

    public CompletableFuture<String> toggleEmergencyMode(String patientId, boolean isEmergency) {
        return contract.toggleEmergencyMode(patientId, isEmergency)
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash())
                .exceptionally(ex -> {
                    throw new RuntimeException("Failed to toggle emergency mode on blockchain", ex);
                });
    }

    public CompletableFuture<String> setEmergencyAccessor(String patientId, String accessorId) {
        return contract.setEmergencyAccessor(patientId, accessorId)
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash())
                .exceptionally(ex -> {
                    throw new RuntimeException("Failed to set emergency accessor on blockchain", ex);
                });
    }
}