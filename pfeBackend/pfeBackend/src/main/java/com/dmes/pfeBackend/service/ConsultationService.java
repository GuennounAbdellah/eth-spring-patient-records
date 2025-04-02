package com.dmes.pfeBackend.service;

import com.dmes.pfeBackend.dto.ConsultationRequest;
import com.dmes.pfeBackend.dto.DeleteConsultationRequest;
import com.dmes.pfeBackend.model.Consultation;

import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.List;
import java.util.concurrent.CompletableFuture;


// It interacts with the ContractService to perform operations related to consultations.
@Service
public class ConsultationService {

    private final ContractService contractService;
    
    
    public ConsultationService(ContractService contractService) {
        this.contractService = contractService;
    }

    public CompletableFuture<String> addConsultation(ConsultationRequest request, String doctorId) {
        return contractService.addConsultation(request.getPatientId(), request.getDetails(), request.getMetadata());
    }

    public CompletableFuture<String> deleteConsultation(DeleteConsultationRequest request) {
        // Convert Long to BigInteger to match the contract
        BigInteger timestamp = BigInteger.valueOf(request.getTimestamp());
        return contractService.deleteConsultation(request.getPatientId(), timestamp);
    }

    public CompletableFuture<List<Consultation>> getPatientConsultations(String patientId, String requesterId) {
        return contractService.getPatientConsultations(patientId, requesterId);
    }
}