package com.dmes.pfeBackend.service;

import com.dmes.pfeBackend.dto.ConsultationRequest;
import com.dmes.pfeBackend.dto.DeleteConsultationRequest;
import com.dmes.pfeBackend.model.Consultation;
import com.dmes.pfeBackend.model.User;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Logger;

@Service
public class ConsultationService {

    private static final Logger logger = Logger.getLogger(ConsultationService.class.getName());
    private final ContractService contractService;
    private final UserService userService;
    private final PermissionService permissionService;

    public ConsultationService(ContractService contractService, 
                              UserService userService,
                              PermissionService permissionService) {
        this.contractService = contractService;
        this.userService = userService;
        this.permissionService = permissionService;
    }

    /**
     * Add a consultation record for a patient
     */
    public CompletableFuture<String> addConsultation(ConsultationRequest request, String doctorId) {
        logger.info("Adding consultation for patientId: " + request.getPatientId() + 
                    " by doctorId: " + doctorId);

        // Validate doctor has permission to add consultations for this patient
        return permissionService.isPermitted(request.getPatientId(), doctorId)
            .thenCompose(hasPermission -> {
                if (!hasPermission) {
                    logger.warning("Permission denied for doctorId: " + doctorId + 
                                  " to add consultation for patientId: " + request.getPatientId());
                    throw new RuntimeException("Doctor does not have permission to add consultations for this patient");
                }
                
                logger.info("Permission verified. Adding consultation to blockchain");
                // Add the consultation through the contract service
                return contractService.addConsultation(
                    request.getPatientId(),
                    request.getDetails(),
                    request.getMetadata() != null ? request.getMetadata() : ""
                );
            });
    }

    /**
     * Delete a consultation record
     */
    public CompletableFuture<String> deleteConsultation(DeleteConsultationRequest request) {
        logger.info("Deleting consultation for patientId: " + request.getPatientId() + 
                    " with timestamp: " + request.getTimestamp());
                    
        return contractService.deleteConsultation(
            request.getPatientId(),
            java.math.BigInteger.valueOf(request.getTimestamp())
        );
    }

    /**
     * Get all consultations for a specific patient
     */
    public CompletableFuture<List<Consultation>> getPatientConsultations(String patientId, String requesterId) {
        logger.info("Getting consultations for patientId: " + patientId + 
                    " requested by: " + requesterId);
                   
        // Check if requester is the patient (self-access) or has permission 
        if (patientId.equals(requesterId)) {
            logger.info("Self-access: patient requesting own consultations");
            return contractService.getPatientConsultations(patientId, requesterId);
        }
        
        // Validate doctor has permission to view patient's consultations
        return permissionService.isPermitted(patientId, requesterId)
            .thenCompose(hasPermission -> {
                if (!hasPermission) {
                    logger.warning("Permission denied for requesterId: " + requesterId + 
                                  " to view consultations for patientId: " + patientId);
                    throw new RuntimeException("Requester does not have permission to view this patient's consultations");
                }
                
                logger.info("Permission verified. Fetching consultations from blockchain");
                return contractService.getPatientConsultations(patientId, requesterId);
            });
    }
}