// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UserManagement.sol";

contract HospitalConsultation is UserManagement {
    struct Consultation {
        string patientId;
        string doctorId;
        string details;            // Encrypted consultation data
        string metadata;           // Additional metadata (could include encryption details)
        uint256 timestamp;
        uint256 createdAt;
        bool isDeleted;            // Soft delete flag
    }

    struct Permission {
        string patientId;
        string doctorId;
        uint256 grantedAt;
        uint256 expiresAt;     // Optional expiration (0 = no expiration)
        bool isValid;
    }

    // Consultation mappings
    mapping(string => mapping(uint256 => Consultation)) private consultations;  // patientId => timestamp => Consultation
    mapping(string => uint256[]) private patientTimestamps;                     // patientId => [timestamps]

    // Permission mappings
    mapping(string => mapping(string => Permission)) private permissions;       // patientId => doctorId => Permission
    mapping(string => string[]) private patientDoctors;                         // patientId => [doctorIds]

    // Emergency access control
    mapping(address => bool) private emergencyAccessors;
    bool public emergencyMode = false;

    event ConsultationAdded(string patientId, string doctorId, uint256 timestamp);
    event ConsultationDeleted(string patientId, uint256 timestamp);
    event AccessGranted(string patientId, string doctorId, uint256 expiresAt);
    event AccessRemoved(string patientId, string doctorId);
    event EmergencyModeChanged(bool active);
    // New event for emergency accessor changes
    event EmergencyAccessorSet(address accessor, bool canAccess);

    modifier onlyDoctor() {
        string memory userId = walletToUserId[msg.sender];
        require(bytes(userId).length > 0, "User not registered");
        require(users[userId].isDoctor, "Only doctors can call this function");
        require(users[userId].isActive, "User account is not active");
        _;
    }

    modifier hasPermission(string memory patientId, string memory requesterId) {
        require(
            isPermitted(patientId, requesterId) || 
            (emergencyMode && emergencyAccessors[msg.sender]), 
            "Access denied: Requester is not permitted to view records for this patient"
        );
        _;
    }

    function addConsultation(
        string memory patientId,
        string memory details,
        string memory metadata
    ) public onlyDoctor returns (bool) {
        string memory doctorId = walletToUserId[msg.sender];
        require(bytes(patientId).length > 0, "patientId is required");
        require(bytes(details).length > 0, "Consultation details are required");
        require(isPermitted(patientId, doctorId), "Doctor does not have permission");

        uint256 timestamp = block.timestamp;
        consultations[patientId][timestamp] = Consultation({
            patientId: patientId,
            doctorId: doctorId,
            details: details,
            metadata: metadata,
            timestamp: timestamp,
            createdAt: block.timestamp,
            isDeleted: false
        });

        patientTimestamps[patientId].push(timestamp);
        emit ConsultationAdded(patientId, doctorId, timestamp);
        return true;
    }

    function deleteConsultation(string memory patientId, uint256 timestamp) public returns (bool) {
        string memory userId = walletToUserId[msg.sender];
        Consultation storage consultation = consultations[patientId][timestamp];

        require(consultation.timestamp > 0, "Consultation not found");
        require(
            keccak256(bytes(userId)) == keccak256(bytes(patientId)) ||
            keccak256(bytes(userId)) == keccak256(bytes(consultation.doctorId)) ||
            users[userId].isAdmin,
            "Not authorized to delete this consultation"
        );

        consultation.isDeleted = true;
        emit ConsultationDeleted(patientId, timestamp);
        return true;
    }

    // Updated with pagination
    function getPatientConsultations(
        string memory patientId,
        string memory requesterId,
        uint256 start,
        uint256 limit
    )
        public
        view
        hasPermission(patientId, requesterId)
        returns (Consultation[] memory)
    {
        uint256[] storage timestamps = patientTimestamps[patientId];
        uint256 activeCount = 0;

        // Count active consultations within range
        for (uint256 i = start; i < timestamps.length && i < start + limit; i++) {
            if (!consultations[patientId][timestamps[i]].isDeleted) {
                activeCount++;
            }
        }

        Consultation[] memory results = new Consultation[](activeCount);
        uint256 resultIndex = 0;

        for (uint256 i = start; i < timestamps.length && i < start + limit; i++) {
            if (!consultations[patientId][timestamps[i]].isDeleted) {
                results[resultIndex] = consultations[patientId][timestamps[i]];
                resultIndex++;
            }
        }

        return results;
    }

    function grantAccess(
        string memory patientId,
        string memory doctorId,
        uint256 expiresAt
    ) public returns (bool) {
        string memory userId = walletToUserId[msg.sender];
        require(bytes(patientId).length > 0, "patientId is required");
        require(bytes(doctorId).length > 0, "doctorId is required");
        require(
            keccak256(bytes(userId)) == keccak256(bytes(patientId)) || users[userId].isAdmin,
            "Only the patient or an admin can grant access"
        );
        require(bytes(users[doctorId].userId).length > 0, "Doctor does not exist");
        require(users[doctorId].isDoctor, "User is not a doctor");
        require(users[doctorId].isActive, "Doctor account is not active");

        if (!permissions[patientId][doctorId].isValid) {
            patientDoctors[patientId].push(doctorId);
        }

        permissions[patientId][doctorId] = Permission({
            patientId: patientId,
            doctorId: doctorId,
            grantedAt: block.timestamp,
            expiresAt: expiresAt,
            isValid: true
        });

        emit AccessGranted(patientId, doctorId, expiresAt);
        return true;
    }

    function removeAccess(string memory patientId, string memory doctorId) public returns (bool) {
        string memory userId = walletToUserId[msg.sender];
        require(bytes(patientId).length > 0, "patientId is required");
        require(bytes(doctorId).length > 0, "doctorId is required");
        require(
            keccak256(bytes(userId)) == keccak256(bytes(patientId)) || users[userId].isAdmin,
            "Only the patient or an admin can remove access"
        );

        if (!permissions[patientId][doctorId].isValid) {
            return false; 
        }

        permissions[patientId][doctorId].isValid = false;
        emit AccessRemoved(patientId, doctorId);
        return true;
    }

    function toggleEmergencyMode(bool active) public onlyAdmin returns (bool) {
        emergencyMode = active;
        emit EmergencyModeChanged(active);
        return true;
    }

    function setEmergencyAccessor(address accessor, bool canAccess) public onlyAdmin returns (bool) {
        emergencyAccessors[accessor] = canAccess;
        emit EmergencyAccessorSet(accessor, canAccess); // New event
        return true;
    }

    function isPermitted(string memory patientId, string memory requesterId) public view returns (bool) {
        if (keccak256(bytes(patientId)) == keccak256(bytes(requesterId))) {
            return true;
        }

        Permission memory permission = permissions[patientId][requesterId];
        if (permission.isValid) {
            if (permission.expiresAt == 0) {
                return true; 
            } else {
                return block.timestamp <= permission.expiresAt;
            }
        }

        return false;
    }
}