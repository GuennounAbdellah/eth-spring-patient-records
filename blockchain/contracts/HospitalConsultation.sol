// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SecureConsultationContract {
    address public owner;
    
    struct User {
        string userId;     // External ID (e.g., from your Spring Boot system)
        address wallet;    // Ethereum wallet address
        bool isDoctor;     // Role flag
        bool isAdmin;      // Role flag
        bool isActive;     // Account status
        uint256 createdAt;
    }
    
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
    
    // User mappings
    mapping(string => User) private users;                 // userId => User
    mapping(address => string) private walletToUserId;     // wallet => userId
    
    // Consultation mappings
    mapping(string => mapping(uint256 => Consultation)) private consultations;  // patientId => timestamp => Consultation
    mapping(string => uint256[]) private patientTimestamps;                     // patientId => [timestamps]
    
    // Permission mappings
    mapping(string => mapping(string => Permission)) private permissions;       // patientId => doctorId => Permission
    mapping(string => string[]) private patientDoctors;                         // patientId => [doctorIds]
    
    // Emergency access control
    mapping(address => bool) private emergencyAccessors;
    bool public emergencyMode = false;
    
    // Events
    event UserRegistered(string userId, address wallet, bool isDoctor, bool isAdmin);
    event UserStatusChanged(string userId, bool isActive);
    event ConsultationAdded(string patientId, string doctorId, uint256 timestamp);
    event ConsultationDeleted(string patientId, uint256 timestamp);
    event AccessGranted(string patientId, string doctorId, uint256 expiresAt);
    event AccessRemoved(string patientId, string doctorId);
    event EmergencyModeChanged(bool active);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }
    
    modifier onlyAdmin() {
        string memory userId = walletToUserId[msg.sender];
        require(bytes(userId).length > 0, "User not registered");
        require(users[userId].isAdmin, "Only admins can call this function");
        require(users[userId].isActive, "User account is not active");
        _;
    }
    
    modifier onlyDoctor() {
        string memory userId = walletToUserId[msg.sender];
        require(bytes(userId).length > 0, "User not registered");
        require(users[userId].isDoctor, "Only doctors can call this function");
        require(users[userId].isActive, "User account is not active");
        _;
    }
    
    modifier activeUser() {
        string memory userId = walletToUserId[msg.sender];
        require(bytes(userId).length > 0, "User not registered");
        require(users[userId].isActive, "User account is not active");
        _;
    }
    
    modifier hasPermission(string memory patientId, string memory requesterId) {
        require(
            isPermitted(patientId, requesterId) || emergencyMode && emergencyAccessors[msg.sender],
            "Access denied: Requester is not permitted to view records for this patient"
        );
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        emergencyAccessors[msg.sender] = true;
    }
    
    // User management functions
    function registerUser(
        string memory userId, 
        address wallet, 
        bool isDoctor, 
        bool isAdmin
    ) 
        public 
        onlyAdmin 
        returns (bool) 
    {
        require(bytes(userId).length > 0, "userId is required");
        require(wallet != address(0), "Valid wallet address is required");
        require(bytes(users[userId].userId).length == 0, "User already exists");
        require(bytes(walletToUserId[wallet]).length == 0, "Wallet already registered");
        
        User memory user = User({
            userId: userId,
            wallet: wallet,
            isDoctor: isDoctor,
            isAdmin: isAdmin,
            isActive: true,
            createdAt: block.timestamp
        });
        
        users[userId] = user;
        walletToUserId[wallet] = userId;
        
        emit UserRegistered(userId, wallet, isDoctor, isAdmin);
        return true;
    }
    
    function setUserStatus(string memory userId, bool isActive) public onlyAdmin returns (bool) {
        require(bytes(userId).length > 0, "userId is required");
        require(bytes(users[userId].userId).length > 0, "User does not exist");
        
        users[userId].isActive = isActive;
        
        emit UserStatusChanged(userId, isActive);
        return true;
    }
    
    // Core consultation functions
    function addConsultation(
        string memory patientId,
        string memory details,
        string memory metadata
    ) 
        public 
        onlyDoctor
        returns (bool) 
    {
        string memory doctorId = walletToUserId[msg.sender];
        require(bytes(patientId).length > 0, "patientId is required");
        require(bytes(details).length > 0, "Consultation details are required");
        require(isPermitted(patientId, doctorId), "Doctor does not have permission");
        
        uint256 timestamp = block.timestamp;
        
        Consultation memory consultation = Consultation({
            patientId: patientId,
            doctorId: doctorId,
            details: details,
            metadata: metadata,
            timestamp: timestamp,
            createdAt: block.timestamp,
            isDeleted: false
        });
        
        consultations[patientId][timestamp] = consultation;
        patientTimestamps[patientId].push(timestamp);
        
        emit ConsultationAdded(patientId, doctorId, timestamp);
        return true;
    }
    
    function deleteConsultation(string memory patientId, uint256 timestamp) 
        public 
        activeUser
        returns (bool) 
    {
        string memory userId = walletToUserId[msg.sender];
        
        // Only the patient, the consultation's doctor, or an admin can delete
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
    
    function getPatientConsultations(string memory patientId, string memory requesterId) 
        public 
        view 
        hasPermission(patientId, requesterId)
        returns (Consultation[] memory) 
    {
        uint256[] storage timestamps = patientTimestamps[patientId];
        
        // Count non-deleted consultations first
        uint256 activeCount = 0;
        for (uint256 i = 0; i < timestamps.length; i++) {
            if (!consultations[patientId][timestamps[i]].isDeleted) {
                activeCount++;
            }
        }
        
        Consultation[] memory results = new Consultation[](activeCount);
        uint256 resultIndex = 0;
        
        for (uint256 i = 0; i < timestamps.length; i++) {
            if (!consultations[patientId][timestamps[i]].isDeleted) {
                results[resultIndex] = consultations[patientId][timestamps[i]];
                resultIndex++;
            }
        }
        
        return results;
    }
    
    function getConsultation(
        string memory patientId, 
        uint256 timestamp, 
        string memory requesterId
    ) 
        public 
        view 
        hasPermission(patientId, requesterId)
        returns (Consultation memory) 
    {
        Consultation memory consultation = consultations[patientId][timestamp];
        require(consultation.timestamp > 0, "Consultation not found");
        require(!consultation.isDeleted, "Consultation has been deleted");
        
        return consultation;
    }
    
    // Permission management
    function isPermitted(string memory patientId, string memory requesterId) public view returns (bool) {
        // Patient can always access their own records
        if (keccak256(bytes(patientId)) == keccak256(bytes(requesterId))) {
            return true;
        }
        
        // Check if permission exists and is valid
        Permission memory permission = permissions[patientId][requesterId];
        
        // Check if permission is valid and not expired
        if (permission.isValid) {
            if (permission.expiresAt == 0) {
                return true; // No expiration
            } else {
                return block.timestamp <= permission.expiresAt;
            }
        }
        
        return false;
    }
    
    function grantAccess(
        string memory patientId, 
        string memory doctorId,
        uint256 expiresAt
    ) 
        public 
        activeUser 
        returns (bool) 
    {
        string memory userId = walletToUserId[msg.sender];
        require(bytes(patientId).length > 0, "patientId is required");
        require(bytes(doctorId).length > 0, "doctorId is required");
        
        // Only the patient or an admin can grant access
        require(
            keccak256(bytes(userId)) == keccak256(bytes(patientId)) || 
            users[userId].isAdmin, 
            "Only the patient or an admin can grant access"
        );
        
        // Check if doctor exists and is active
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
    
    function removeAccess(string memory patientId, string memory doctorId) 
        public 
        activeUser 
        returns (bool) 
    {
        string memory userId = walletToUserId[msg.sender];
        require(bytes(patientId).length > 0, "patientId is required");
        require(bytes(doctorId).length > 0, "doctorId is required");
        
        // Only the patient or an admin can remove access
        require(
            keccak256(bytes(userId)) == keccak256(bytes(patientId)) || 
            users[userId].isAdmin, 
            "Only the patient or an admin can remove access"
        );
        
        if (!permissions[patientId][doctorId].isValid) {
            return false; // Already removed
        }
        
        permissions[patientId][doctorId].isValid = false;
        
        emit AccessRemoved(patientId, doctorId);
        return true;
    }
    
    function getDoctorsWithAccess(string memory patientId, string memory requesterId) 
        public 
        view 
        hasPermission(patientId, requesterId)
        returns (string[] memory doctorIds) 
    {
        string[] memory doctorList = patientDoctors[patientId];
        uint validCount = 0;
        
        // Count valid permissions first
        for (uint i = 0; i < doctorList.length; i++) {
            if (permissions[patientId][doctorList[i]].isValid) {
                validCount++;
            }
        }
        
        // Create result array
        string[] memory result = new string[](validCount);
        uint resultIndex = 0;
        
        // Fill with valid permissions
        for (uint i = 0; i < doctorList.length; i++) {
            if (permissions[patientId][doctorList[i]].isValid) {
                result[resultIndex] = doctorList[i];
                resultIndex++;
            }
        }
        
        return result;
    }
    
    // Emergency functions
    function toggleEmergencyMode(bool active) public onlyAdmin returns (bool) {
        emergencyMode = active;
        emit EmergencyModeChanged(active);
        return true;
    }
    
    function setEmergencyAccessor(address accessor, bool canAccess) public onlyAdmin returns (bool) {
        emergencyAccessors[accessor] = canAccess;
        return true;
    }
    
    // Gas optimization for bulk operations
    function bulkGrantAccess(
        string memory patientId,
        string[] memory doctorIds,
        uint256 expiresAt
    )
        public
        activeUser
        returns (bool)
    {
        string memory userId = walletToUserId[msg.sender];
        require(bytes(patientId).length > 0, "patientId is required");
        
        // Only the patient or an admin can grant access
        require(
            keccak256(bytes(userId)) == keccak256(bytes(patientId)) || 
            users[userId].isAdmin, 
            "Only the patient or an admin can grant access"
        );
        
        for (uint i = 0; i < doctorIds.length; i++) {
            string memory doctorId = doctorIds[i];
            
            // Skip invalid doctors but continue processing
            if (bytes(users[doctorId].userId).length == 0 || !users[doctorId].isDoctor || !users[doctorId].isActive) {
                continue;
            }
            
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
        }
        
        return true;
    }
}