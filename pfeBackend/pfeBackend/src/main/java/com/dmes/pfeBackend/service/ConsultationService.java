package com.dmes.pfeBackend.service;

import com.dmes.pfeBackend.dto.ConsultationRequest;
import com.dmes.pfeBackend.dto.DeleteConsultationRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

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
        return contractService.deleteConsultation(request.getPatientId(), request.getTimestamp());
    }

    public CompletableFuture<List> getPatientConsultations(String patientId, String requesterId) {
        return contractService.getPatientConsultations(patientId, requesterId);
    }
}