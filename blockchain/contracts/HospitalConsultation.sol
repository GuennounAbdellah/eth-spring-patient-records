// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HospitalConsultation {
    address public owner;
    
    struct User {
        string userId;     // External ID 
        address wallet;    // Ethereum wallet address
        bool isDoctor;     // Role flag
        bool isAdmin;      // Role flag
        bool isActive;     // Account status
    }
    
    struct Consultation {
        string patientId;
        string doctorId;
        string details;    // Encrypted consultation data
        string metadata;   // Additional metadata
        uint256 timestamp;
        bool isDeleted;    // Soft delete flag
    }
    
    struct Permission {
        string patientId;
        string doctorId;
        uint256 expiresAt; // 0 = no expiration
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
    mapping(string => string[]) private doctorPatients;                         // doctorId => [patientIds]
    
    // Emergency access
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
        require(msg.sender == owner, "Only owner allowed");
        _;
    }
    
    modifier onlyAdmin() {
        string memory userId = walletToUserId[msg.sender];
        require(bytes(userId).length > 0, "User not registered");
        require(users[userId].isAdmin, "Only admins allowed");
        require(users[userId].isActive, "Account not active");
        _;
    }
    
    modifier onlyDoctor() {
        string memory userId = walletToUserId[msg.sender];
        require(bytes(userId).length > 0, "User not registered");
        require(users[userId].isDoctor, "Only doctors allowed");
        require(users[userId].isActive, "Account not active");
        _;
    }
    
    modifier activeUser() {
        string memory userId = walletToUserId[msg.sender];
        require(bytes(userId).length > 0, "User not registered");
        require(users[userId].isActive, "Account not active");
        _;
    }
    
    modifier hasPermission(string memory patientId, string memory requesterId) {
        require(
            isPermitted(patientId, requesterId) || (emergencyMode && emergencyAccessors[msg.sender]),
            "Access denied"
        );
        _;
    }
    
    constructor() {
        owner = msg.sender;
        users[string(abi.encodePacked(msg.sender))] = User({
            userId: string(abi.encodePacked(msg.sender)),
            wallet: msg.sender,
            isDoctor: false,
            isAdmin: true,
            isActive: true
        });
        walletToUserId[msg.sender] = string(abi.encodePacked(msg.sender));
    }
    
    // User management
    function registerUser(string memory userId, address wallet, bool isDoctor, bool isAdmin) 
        public 
        onlyAdmin 
        returns (bool) 
    {
        require(bytes(userId).length > 0, "userId required");
        require(wallet != address(0), "Valid wallet required");
        require(bytes(users[userId].userId).length == 0, "User exists");
        require(bytes(walletToUserId[wallet]).length == 0, "Wallet registered");
        
        users[userId] = User({
            userId: userId,
            wallet: wallet,
            isDoctor: isDoctor,
            isAdmin: isAdmin,
            isActive: true
        });
        
        walletToUserId[wallet] = userId;
        
        emit UserRegistered(userId, wallet, isDoctor, isAdmin);
        return true;
    }
    
    function setUserStatus(string memory userId, bool isActive) 
        public 
        onlyAdmin 
        returns (bool) 
    {
        require(bytes(userId).length > 0, "userId required");
        require(bytes(users[userId].userId).length > 0, "User not found");
        
        users[userId].isActive = isActive;
        
        emit UserStatusChanged(userId, isActive);
        return true;
    }
    
    // Consultation functions
    function addConsultation(string memory patientId, string memory details, string memory metadata) 
        public 
        onlyDoctor
        returns (bool) 
    {
        string memory doctorId = walletToUserId[msg.sender];
        require(bytes(patientId).length > 0, "patientId required");
        require(bytes(details).length > 0, "Details required");
        require(isPermitted(patientId, doctorId), "No permission");
        
        uint256 timestamp = block.timestamp;
        
        consultations[patientId][timestamp] = Consultation({
            patientId: patientId,
            doctorId: doctorId,
            details: details,
            metadata: metadata,
            timestamp: timestamp,
            isDeleted: false
        });
        
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
        
        Consultation storage consultation = consultations[patientId][timestamp];
        require(consultation.timestamp > 0, "Not found");
        require(
            keccak256(bytes(userId)) == keccak256(bytes(patientId)) || 
            keccak256(bytes(userId)) == keccak256(bytes(consultation.doctorId)) ||
            users[userId].isAdmin,
            "Not authorized"
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
    
    // Permission management
    function isPermitted(string memory patientId, string memory requesterId) 
        public 
        view 
        returns (bool) 
    {
        // Patient can access own records
        if (keccak256(bytes(patientId)) == keccak256(bytes(requesterId))) {
            return true;
        }
        
        Permission memory permission = permissions[patientId][requesterId];
        
        if (permission.isValid) {
            if (permission.expiresAt == 0) {
                return true; // No expiration
            } else {
                return block.timestamp <= permission.expiresAt;
            }
        }
        
        return false;
    }
    
    // Grant access to a doctor
    function grantAccess(string memory patientId, string memory doctorId, uint256 expiresAt) 
        public 
        activeUser
        returns (bool) 
    {
        string memory requesterId = walletToUserId[msg.sender];
        
        // Only patient themselves or admin can grant access
        require(
            keccak256(bytes(requesterId)) == keccak256(bytes(patientId)) || 
            users[requesterId].isAdmin, 
            "Not authorized"
        );
        
        // Check that doctor exists
        require(bytes(users[doctorId].userId).length > 0, "Doctor not found");
        
        // Check that doctor is active
        require(users[doctorId].isActive, "Doctor account not active");
        
        // Make sure the doctorId actually belongs to a doctor
        require(users[doctorId].isDoctor, "User is not a doctor");
        
        // If expiresAt is 0, set default expiration to 1 year (365 days)
        uint256 expiration = expiresAt;
        if (expiration == 0) {
            expiration = block.timestamp + 365 days;
        }
            
        permissions[patientId][doctorId] = Permission({
            patientId: patientId,
            doctorId: doctorId,
            expiresAt: expiration,
            isValid: true
        });
        
        // Add to relationship mappings if not already there
        bool doctorExists = false;
        for (uint i = 0; i < patientDoctors[patientId].length; i++) {
            if (keccak256(bytes(patientDoctors[patientId][i])) == keccak256(bytes(doctorId))) {
                doctorExists = true;
                break;
            }
        }
        
        if (!doctorExists) {
            patientDoctors[patientId].push(doctorId);
        }
        
        bool patientExists = false;
        for (uint i = 0; i < doctorPatients[doctorId].length; i++) {
            if (keccak256(bytes(doctorPatients[doctorId][i])) == keccak256(bytes(patientId))) {
                patientExists = true;
                break;
            }
        }
        
        if (!patientExists) {
            doctorPatients[doctorId].push(patientId);
        }
        
        emit AccessGranted(patientId, doctorId, expiration);
        return true;
    }
    
    function removeAccess(string memory patientId, string memory doctorId) 
        public 
        activeUser 
        returns (bool) 
    {
        string memory userId = walletToUserId[msg.sender];
        require(bytes(patientId).length > 0, "patientId required");
        require(bytes(doctorId).length > 0, "doctorId required");
        
        // Only patient or admin can remove access
        require(
            keccak256(bytes(userId)) == keccak256(bytes(patientId)) || 
            users[userId].isAdmin, 
            "Not authorized"
        );
        
        if (!permissions[patientId][doctorId].isValid) {
            return false; // Already removed
        }
        
        permissions[patientId][doctorId].isValid = false;
        
        emit AccessRemoved(patientId, doctorId);
        return true;
    }
    
    // Get all patients a doctor has access to
    function getDoctorPatients(string memory doctorId) 
        public 
        view 
        returns (string[] memory) 
    {
        string memory requesterId = walletToUserId[msg.sender];
        
        // Only the doctor themselves or an admin can check this
        require(
            keccak256(bytes(requesterId)) == keccak256(bytes(doctorId)) || 
            users[requesterId].isAdmin,
            "Not authorized"
        );
        
        string[] memory allPatients = doctorPatients[doctorId];
        uint validCount = 0;
        
        // Count valid permissions
        for (uint i = 0; i < allPatients.length; i++) {
            if (isPermitted(allPatients[i], doctorId)) {
                validCount++;
            }
        }
        
        // Create result array with valid permissions only
        string[] memory result = new string[](validCount);
        uint resultIndex = 0;
        
        for (uint i = 0; i < allPatients.length; i++) {
            if (isPermitted(allPatients[i], doctorId)) {
                result[resultIndex] = allPatients[i];
                resultIndex++;
            }
        }
        
        return result;
    }


    // Get all doctors that have access to a patient
    function getPatientDoctors(string memory patientId) 
        public 
        view 
        returns (string[] memory) 
    {
        string memory requesterId = walletToUserId[msg.sender];
        
        // Only the patient themselves, an admin, or in emergency mode can check this
        require(
            keccak256(bytes(requesterId)) == keccak256(bytes(patientId)) || 
            users[requesterId].isAdmin ||
            (emergencyMode && emergencyAccessors[msg.sender]),
            "Not authorized"
        );
        
        string[] memory allDoctors = patientDoctors[patientId];
        uint validCount = 0;
        
        // Count valid permissions (not expired and still valid)
        for (uint i = 0; i < allDoctors.length; i++) {
            Permission memory perm = permissions[patientId][allDoctors[i]];
            
            // Check if permission is valid and not expired
            if (perm.isValid && (perm.expiresAt == 0 || perm.expiresAt > block.timestamp)) {
                validCount++;
            }
        }
        
        // Create result array with valid permissions only
        string[] memory result = new string[](validCount);
        uint resultIndex = 0;
        
        for (uint i = 0; i < allDoctors.length; i++) {
            Permission memory perm = permissions[patientId][allDoctors[i]];
            
            // Add only valid and non-expired permissions
            if (perm.isValid && (perm.expiresAt == 0 || perm.expiresAt > block.timestamp)) {
                result[resultIndex] = allDoctors[i];
                resultIndex++;
            }
        }
        
        return result;
    }
    
    // Emergency functions
    function toggleEmergencyMode(bool active) 
        public 
        onlyAdmin 
        returns (bool) 
    {
        emergencyMode = active;
        emit EmergencyModeChanged(active);
        return true;
    }
    
    function setEmergencyAccessor(address accessor, bool canAccess) 
        public 
        onlyAdmin 
        returns (bool) 
    {
        emergencyAccessors[accessor] = canAccess;
        return true;
    }
}