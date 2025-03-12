package com.dmes.pfeBackend.service;

import com.healthcare.blockchain.contract.HealthRecordContract;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.tx.gas.ContractGasProvider;

import java.math.BigInteger;
import java.util.List;
import java.util.concurrent.CompletableFuture;

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
                .thenApply(tx -> tx.getTransactionHash());
    }

    public CompletableFuture<String> setUserStatus(String userId, boolean isActive) {
        return contract.setUserStatus(userId, isActive)
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash());
    }

    public CompletableFuture<String> addConsultation(String patientId, String details, String metadata) {
        return contract.addConsultation(patientId, details, metadata)
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash());
    }

    public CompletableFuture<String> deleteConsultation(String patientId, Long timestamp) {
        return contract.deleteConsultation(patientId, BigInteger.valueOf(timestamp))
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash());
    }

    public CompletableFuture<List> getPatientConsultations(String patientId, String requesterId) {
        return contract.getPatientConsultations(patientId, requesterId)
                .sendAsync();
    }

    public CompletableFuture<String> grantAccess(String patientId, String doctorId, Long expiresAt) {
        return contract.grantAccess(patientId, doctorId, BigInteger.valueOf(expiresAt))
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash());
    }

    public CompletableFuture<String> removeAccess(String patientId, String doctorId) {
        return contract.removeAccess(patientId, doctorId)
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash());
    }

    public CompletableFuture<Boolean> isPermitted(String patientId, String requesterId) {
        return contract.isPermitted(patientId, requesterId)
                .sendAsync();
    }

    public CompletableFuture<String> toggleEmergencyMode(String patientId, boolean isEmergency) {
        return contract.toggleEmergencyMode(patientId, isEmergency)
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash());
    }

    public CompletableFuture<String> setEmergencyAccessor(String patientId, String accessorId) {
        return contract.setEmergencyAccessor(patientId, accessorId)
                .sendAsync()
                .thenApply(tx -> tx.getTransactionHash());
    }
}
