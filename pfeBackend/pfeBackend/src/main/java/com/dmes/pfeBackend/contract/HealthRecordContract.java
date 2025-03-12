package com.dmes.pfeBackend.contract;

import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.*;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.gas.ContractGasProvider;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class HealthRecordContract extends Contract {
    
    private static final String BINARY = "0x..."; // Contract binary

    public HealthRecordContract(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    public RemoteFunctionCall<TransactionReceipt> registerUser(String userId, String walletAddress) {
        Function function = new Function(
                "registerUser",
                Arrays.asList(new Utf8String(userId), new Address(walletAddress)),
                Collections.emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setUserStatus(String userId, Boolean isActive) {
        Function function = new Function(
                "setUserStatus",
                Arrays.asList(new Utf8String(userId), new Bool(isActive)),
                Collections.emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> addConsultation(String patientId, String details, String metadata) {
        Function function = new Function(
                "addConsultation",
                Arrays.asList(new Utf8String(patientId), new Utf8String(details), new Utf8String(metadata)),
                Collections.emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> deleteConsultation(String patientId, BigInteger timestamp) {
        Function function = new Function(
                "deleteConsultation",
                Arrays.asList(new Utf8String(patientId), new Uint256(timestamp)),
                Collections.emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<List> getPatientConsultations(String patientId, String requesterId) {
        Function function = new Function(
                "getPatientConsultations",
                Arrays.asList(new Utf8String(patientId), new Utf8String(requesterId)),
                Arrays.asList(new TypeReference<DynamicArray<Type>>() {}));
        return executeRemoteCallSingleValueReturn(function, List.class);
    }

    public RemoteFunctionCall<TransactionReceipt> grantAccess(String patientId, String doctorId, BigInteger expiresAt) {
        Function function = new Function(
                "grantAccess",
                Arrays.asList(new Utf8String(patientId), new Utf8String(doctorId), new Uint256(expiresAt)),
                Collections.emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> removeAccess(String patientId, String doctorId) {
        Function function = new Function(
                "removeAccess",
                Arrays.asList(new Utf8String(patientId), new Utf8String(doctorId)),
                Collections.emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<Boolean> isPermitted(String patientId, String requesterId) {
        Function function = new Function(
                "isPermitted",
                Arrays.asList(new Utf8String(patientId), new Utf8String(requesterId)),
                Arrays.asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<TransactionReceipt> toggleEmergencyMode(String patientId, Boolean isEmergency) {
        Function function = new Function(
                "toggleEmergencyMode",
                Arrays.asList(new Utf8String(patientId), new Bool(isEmergency)),
                Collections.emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setEmergencyAccessor(String patientId, String accessorId) {
        Function function = new Function(
                "setEmergencyAccessor",
                Arrays.asList(new Utf8String(patientId), new Utf8String(accessorId)),
                Collections.emptyList());
        return executeRemoteCallTransaction(function);
    }
}