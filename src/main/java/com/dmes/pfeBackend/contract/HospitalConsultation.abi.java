package com.dmes.pfeBackend.contract;

import io.reactivex.Flowable;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.DynamicArray;
import org.web3j.abi.datatypes.DynamicStruct;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.BaseEventResponse;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/hyperledger-web3j/web3j/tree/main/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 1.6.3.
 */
@SuppressWarnings("rawtypes")
public class HospitalConsultation.abi extends Contract {
    public static final String BINARY = "Bin file was not provided";

    public static final String FUNC_ADDCONSULTATION = "addConsultation";

    public static final String FUNC_DELETECONSULTATION = "deleteConsultation";

    public static final String FUNC_EMERGENCYMODE = "emergencyMode";

    public static final String FUNC_GETDOCTORPATIENTS = "getDoctorPatients";

    public static final String FUNC_GETPATIENTCONSULTATIONS = "getPatientConsultations";

    public static final String FUNC_GETPATIENTDOCTORS = "getPatientDoctors";

    public static final String FUNC_GRANTACCESS = "grantAccess";

    public static final String FUNC_ISPERMITTED = "isPermitted";

    public static final String FUNC_OWNER = "owner";

    public static final String FUNC_REGISTERUSER = "registerUser";

    public static final String FUNC_REMOVEACCESS = "removeAccess";

    public static final String FUNC_SETEMERGENCYACCESSOR = "setEmergencyAccessor";

    public static final String FUNC_SETUSERSTATUS = "setUserStatus";

    public static final String FUNC_TOGGLEEMERGENCYMODE = "toggleEmergencyMode";

    public static final Event ACCESSGRANTED_EVENT = new Event("AccessGranted", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}, new TypeReference<Utf8String>() {}, new TypeReference<Uint256>() {}));
    ;

    public static final Event ACCESSREMOVED_EVENT = new Event("AccessRemoved", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}, new TypeReference<Utf8String>() {}));
    ;

    public static final Event CONSULTATIONADDED_EVENT = new Event("ConsultationAdded", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}, new TypeReference<Utf8String>() {}, new TypeReference<Uint256>() {}));
    ;

    public static final Event CONSULTATIONDELETED_EVENT = new Event("ConsultationDeleted", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}, new TypeReference<Uint256>() {}));
    ;

    public static final Event EMERGENCYMODECHANGED_EVENT = new Event("EmergencyModeChanged", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
    ;

    public static final Event USERREGISTERED_EVENT = new Event("UserRegistered", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}, new TypeReference<Address>() {}, new TypeReference<Bool>() {}, new TypeReference<Bool>() {}));
    ;

    public static final Event USERSTATUSCHANGED_EVENT = new Event("UserStatusChanged", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}, new TypeReference<Bool>() {}));
    ;

    @Deprecated
    protected HospitalConsultation.abi(String contractAddress, Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected HospitalConsultation.abi(String contractAddress, Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected HospitalConsultation.abi(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected HospitalConsultation.abi(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static List<AccessGrantedEventResponse> getAccessGrantedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(ACCESSGRANTED_EVENT, transactionReceipt);
        ArrayList<AccessGrantedEventResponse> responses = new ArrayList<AccessGrantedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            AccessGrantedEventResponse typedResponse = new AccessGrantedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.patientId = (String) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.doctorId = (String) eventValues.getNonIndexedValues().get(1).getValue();
            typedResponse.expiresAt = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static AccessGrantedEventResponse getAccessGrantedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(ACCESSGRANTED_EVENT, log);
        AccessGrantedEventResponse typedResponse = new AccessGrantedEventResponse();
        typedResponse.log = log;
        typedResponse.patientId = (String) eventValues.getNonIndexedValues().get(0).getValue();
        typedResponse.doctorId = (String) eventValues.getNonIndexedValues().get(1).getValue();
        typedResponse.expiresAt = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
        return typedResponse;
    }

    public Flowable<AccessGrantedEventResponse> accessGrantedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getAccessGrantedEventFromLog(log));
    }

    public Flowable<AccessGrantedEventResponse> accessGrantedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(ACCESSGRANTED_EVENT));
        return accessGrantedEventFlowable(filter);
    }

    public static List<AccessRemovedEventResponse> getAccessRemovedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(ACCESSREMOVED_EVENT, transactionReceipt);
        ArrayList<AccessRemovedEventResponse> responses = new ArrayList<AccessRemovedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            AccessRemovedEventResponse typedResponse = new AccessRemovedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.patientId = (String) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.doctorId = (String) eventValues.getNonIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static AccessRemovedEventResponse getAccessRemovedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(ACCESSREMOVED_EVENT, log);
        AccessRemovedEventResponse typedResponse = new AccessRemovedEventResponse();
        typedResponse.log = log;
        typedResponse.patientId = (String) eventValues.getNonIndexedValues().get(0).getValue();
        typedResponse.doctorId = (String) eventValues.getNonIndexedValues().get(1).getValue();
        return typedResponse;
    }

    public Flowable<AccessRemovedEventResponse> accessRemovedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getAccessRemovedEventFromLog(log));
    }

    public Flowable<AccessRemovedEventResponse> accessRemovedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(ACCESSREMOVED_EVENT));
        return accessRemovedEventFlowable(filter);
    }

    public static List<ConsultationAddedEventResponse> getConsultationAddedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(CONSULTATIONADDED_EVENT, transactionReceipt);
        ArrayList<ConsultationAddedEventResponse> responses = new ArrayList<ConsultationAddedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            ConsultationAddedEventResponse typedResponse = new ConsultationAddedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.patientId = (String) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.doctorId = (String) eventValues.getNonIndexedValues().get(1).getValue();
            typedResponse.timestamp = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static ConsultationAddedEventResponse getConsultationAddedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(CONSULTATIONADDED_EVENT, log);
        ConsultationAddedEventResponse typedResponse = new ConsultationAddedEventResponse();
        typedResponse.log = log;
        typedResponse.patientId = (String) eventValues.getNonIndexedValues().get(0).getValue();
        typedResponse.doctorId = (String) eventValues.getNonIndexedValues().get(1).getValue();
        typedResponse.timestamp = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
        return typedResponse;
    }

    public Flowable<ConsultationAddedEventResponse> consultationAddedEventFlowable(
            EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getConsultationAddedEventFromLog(log));
    }

    public Flowable<ConsultationAddedEventResponse> consultationAddedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(CONSULTATIONADDED_EVENT));
        return consultationAddedEventFlowable(filter);
    }

    public static List<ConsultationDeletedEventResponse> getConsultationDeletedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(CONSULTATIONDELETED_EVENT, transactionReceipt);
        ArrayList<ConsultationDeletedEventResponse> responses = new ArrayList<ConsultationDeletedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            ConsultationDeletedEventResponse typedResponse = new ConsultationDeletedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.patientId = (String) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.timestamp = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static ConsultationDeletedEventResponse getConsultationDeletedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(CONSULTATIONDELETED_EVENT, log);
        ConsultationDeletedEventResponse typedResponse = new ConsultationDeletedEventResponse();
        typedResponse.log = log;
        typedResponse.patientId = (String) eventValues.getNonIndexedValues().get(0).getValue();
        typedResponse.timestamp = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
        return typedResponse;
    }

    public Flowable<ConsultationDeletedEventResponse> consultationDeletedEventFlowable(
            EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getConsultationDeletedEventFromLog(log));
    }

    public Flowable<ConsultationDeletedEventResponse> consultationDeletedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(CONSULTATIONDELETED_EVENT));
        return consultationDeletedEventFlowable(filter);
    }

    public static List<EmergencyModeChangedEventResponse> getEmergencyModeChangedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(EMERGENCYMODECHANGED_EVENT, transactionReceipt);
        ArrayList<EmergencyModeChangedEventResponse> responses = new ArrayList<EmergencyModeChangedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            EmergencyModeChangedEventResponse typedResponse = new EmergencyModeChangedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.active = (Boolean) eventValues.getNonIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static EmergencyModeChangedEventResponse getEmergencyModeChangedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(EMERGENCYMODECHANGED_EVENT, log);
        EmergencyModeChangedEventResponse typedResponse = new EmergencyModeChangedEventResponse();
        typedResponse.log = log;
        typedResponse.active = (Boolean) eventValues.getNonIndexedValues().get(0).getValue();
        return typedResponse;
    }

    public Flowable<EmergencyModeChangedEventResponse> emergencyModeChangedEventFlowable(
            EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getEmergencyModeChangedEventFromLog(log));
    }

    public Flowable<EmergencyModeChangedEventResponse> emergencyModeChangedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(EMERGENCYMODECHANGED_EVENT));
        return emergencyModeChangedEventFlowable(filter);
    }

    public static List<UserRegisteredEventResponse> getUserRegisteredEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(USERREGISTERED_EVENT, transactionReceipt);
        ArrayList<UserRegisteredEventResponse> responses = new ArrayList<UserRegisteredEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            UserRegisteredEventResponse typedResponse = new UserRegisteredEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.userId = (String) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.wallet = (String) eventValues.getNonIndexedValues().get(1).getValue();
            typedResponse.isDoctor = (Boolean) eventValues.getNonIndexedValues().get(2).getValue();
            typedResponse.isAdmin = (Boolean) eventValues.getNonIndexedValues().get(3).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static UserRegisteredEventResponse getUserRegisteredEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(USERREGISTERED_EVENT, log);
        UserRegisteredEventResponse typedResponse = new UserRegisteredEventResponse();
        typedResponse.log = log;
        typedResponse.userId = (String) eventValues.getNonIndexedValues().get(0).getValue();
        typedResponse.wallet = (String) eventValues.getNonIndexedValues().get(1).getValue();
        typedResponse.isDoctor = (Boolean) eventValues.getNonIndexedValues().get(2).getValue();
        typedResponse.isAdmin = (Boolean) eventValues.getNonIndexedValues().get(3).getValue();
        return typedResponse;
    }

    public Flowable<UserRegisteredEventResponse> userRegisteredEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getUserRegisteredEventFromLog(log));
    }

    public Flowable<UserRegisteredEventResponse> userRegisteredEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(USERREGISTERED_EVENT));
        return userRegisteredEventFlowable(filter);
    }

    public static List<UserStatusChangedEventResponse> getUserStatusChangedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(USERSTATUSCHANGED_EVENT, transactionReceipt);
        ArrayList<UserStatusChangedEventResponse> responses = new ArrayList<UserStatusChangedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            UserStatusChangedEventResponse typedResponse = new UserStatusChangedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.userId = (String) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.isActive = (Boolean) eventValues.getNonIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static UserStatusChangedEventResponse getUserStatusChangedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(USERSTATUSCHANGED_EVENT, log);
        UserStatusChangedEventResponse typedResponse = new UserStatusChangedEventResponse();
        typedResponse.log = log;
        typedResponse.userId = (String) eventValues.getNonIndexedValues().get(0).getValue();
        typedResponse.isActive = (Boolean) eventValues.getNonIndexedValues().get(1).getValue();
        return typedResponse;
    }

    public Flowable<UserStatusChangedEventResponse> userStatusChangedEventFlowable(
            EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getUserStatusChangedEventFromLog(log));
    }

    public Flowable<UserStatusChangedEventResponse> userStatusChangedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(USERSTATUSCHANGED_EVENT));
        return userStatusChangedEventFlowable(filter);
    }

    public RemoteFunctionCall<TransactionReceipt> addConsultation(String patientId, String details,
            String metadata) {
        final Function function = new Function(
                FUNC_ADDCONSULTATION, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(patientId), 
                new org.web3j.abi.datatypes.Utf8String(details), 
                new org.web3j.abi.datatypes.Utf8String(metadata)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> deleteConsultation(String patientId,
            BigInteger timestamp) {
        final Function function = new Function(
                FUNC_DELETECONSULTATION, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(patientId), 
                new org.web3j.abi.datatypes.generated.Uint256(timestamp)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<Boolean> emergencyMode() {
        final Function function = new Function(FUNC_EMERGENCYMODE, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<List> getDoctorPatients(String doctorId) {
        final Function function = new Function(FUNC_GETDOCTORPATIENTS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(doctorId)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Utf8String>>() {}));
        return new RemoteFunctionCall<List>(function,
                new Callable<List>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public List call() throws Exception {
                        List<Type> result = (List<Type>) executeCallSingleValueReturn(function, List.class);
                        return convertToNative(result);
                    }
                });
    }

    public RemoteFunctionCall<List> getPatientConsultations(String patientId, String requesterId) {
        final Function function = new Function(FUNC_GETPATIENTCONSULTATIONS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(patientId), 
                new org.web3j.abi.datatypes.Utf8String(requesterId)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Consultation>>() {}));
        return new RemoteFunctionCall<List>(function,
                new Callable<List>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public List call() throws Exception {
                        List<Type> result = (List<Type>) executeCallSingleValueReturn(function, List.class);
                        return convertToNative(result);
                    }
                });
    }

    public RemoteFunctionCall<List> getPatientDoctors(String patientId) {
        final Function function = new Function(FUNC_GETPATIENTDOCTORS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(patientId)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Utf8String>>() {}));
        return new RemoteFunctionCall<List>(function,
                new Callable<List>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public List call() throws Exception {
                        List<Type> result = (List<Type>) executeCallSingleValueReturn(function, List.class);
                        return convertToNative(result);
                    }
                });
    }

    public RemoteFunctionCall<TransactionReceipt> grantAccess(String patientId, String doctorId,
            BigInteger expiresAt) {
        final Function function = new Function(
                FUNC_GRANTACCESS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(patientId), 
                new org.web3j.abi.datatypes.Utf8String(doctorId), 
                new org.web3j.abi.datatypes.generated.Uint256(expiresAt)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<Boolean> isPermitted(String patientId, String requesterId) {
        final Function function = new Function(FUNC_ISPERMITTED, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(patientId), 
                new org.web3j.abi.datatypes.Utf8String(requesterId)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<String> owner() {
        final Function function = new Function(FUNC_OWNER, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<TransactionReceipt> registerUser(String userId, String wallet,
            Boolean isDoctor, Boolean isAdmin) {
        final Function function = new Function(
                FUNC_REGISTERUSER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(userId), 
                new org.web3j.abi.datatypes.Address(160, wallet), 
                new org.web3j.abi.datatypes.Bool(isDoctor), 
                new org.web3j.abi.datatypes.Bool(isAdmin)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> removeAccess(String patientId, String doctorId) {
        final Function function = new Function(
                FUNC_REMOVEACCESS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(patientId), 
                new org.web3j.abi.datatypes.Utf8String(doctorId)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setEmergencyAccessor(String accessor,
            Boolean canAccess) {
        final Function function = new Function(
                FUNC_SETEMERGENCYACCESSOR, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, accessor), 
                new org.web3j.abi.datatypes.Bool(canAccess)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> setUserStatus(String userId, Boolean isActive) {
        final Function function = new Function(
                FUNC_SETUSERSTATUS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(userId), 
                new org.web3j.abi.datatypes.Bool(isActive)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> toggleEmergencyMode(Boolean active) {
        final Function function = new Function(
                FUNC_TOGGLEEMERGENCYMODE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Bool(active)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @Deprecated
    public static HospitalConsultation.abi load(String contractAddress, Web3j web3j,
            Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new HospitalConsultation.abi(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static HospitalConsultation.abi load(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new HospitalConsultation.abi(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static HospitalConsultation.abi load(String contractAddress, Web3j web3j,
            Credentials credentials, ContractGasProvider contractGasProvider) {
        return new HospitalConsultation.abi(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static HospitalConsultation.abi load(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new HospitalConsultation.abi(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static class Consultation extends DynamicStruct {
        public String patientId;

        public String doctorId;

        public String details;

        public String metadata;

        public BigInteger timestamp;

        public Boolean isDeleted;

        public Consultation(String patientId, String doctorId, String details, String metadata,
                BigInteger timestamp, Boolean isDeleted) {
            super(new org.web3j.abi.datatypes.Utf8String(patientId), 
                    new org.web3j.abi.datatypes.Utf8String(doctorId), 
                    new org.web3j.abi.datatypes.Utf8String(details), 
                    new org.web3j.abi.datatypes.Utf8String(metadata), 
                    new org.web3j.abi.datatypes.generated.Uint256(timestamp), 
                    new org.web3j.abi.datatypes.Bool(isDeleted));
            this.patientId = patientId;
            this.doctorId = doctorId;
            this.details = details;
            this.metadata = metadata;
            this.timestamp = timestamp;
            this.isDeleted = isDeleted;
        }

        public Consultation(Utf8String patientId, Utf8String doctorId, Utf8String details,
                Utf8String metadata, Uint256 timestamp, Bool isDeleted) {
            super(patientId, doctorId, details, metadata, timestamp, isDeleted);
            this.patientId = patientId.getValue();
            this.doctorId = doctorId.getValue();
            this.details = details.getValue();
            this.metadata = metadata.getValue();
            this.timestamp = timestamp.getValue();
            this.isDeleted = isDeleted.getValue();
        }
    }

    public static class AccessGrantedEventResponse extends BaseEventResponse {
        public String patientId;

        public String doctorId;

        public BigInteger expiresAt;
    }

    public static class AccessRemovedEventResponse extends BaseEventResponse {
        public String patientId;

        public String doctorId;
    }

    public static class ConsultationAddedEventResponse extends BaseEventResponse {
        public String patientId;

        public String doctorId;

        public BigInteger timestamp;
    }

    public static class ConsultationDeletedEventResponse extends BaseEventResponse {
        public String patientId;

        public BigInteger timestamp;
    }

    public static class EmergencyModeChangedEventResponse extends BaseEventResponse {
        public Boolean active;
    }

    public static class UserRegisteredEventResponse extends BaseEventResponse {
        public String userId;

        public String wallet;

        public Boolean isDoctor;

        public Boolean isAdmin;
    }

    public static class UserStatusChangedEventResponse extends BaseEventResponse {
        public String userId;

        public Boolean isActive;
    }
}
