package com.dmes.pfeBackend.service;

import com.dmes.pfeBackend.dto.DoctorRegistrationRequest;
import com.dmes.pfeBackend.dto.PatientRegistrationRequest;
import com.dmes.pfeBackend.dto.ProfileResponse;
import com.dmes.pfeBackend.dto.RegistrationRequest;
import com.dmes.pfeBackend.dto.UserStatusUpdateRequest;
import com.dmes.pfeBackend.model.*;
import com.dmes.pfeBackend.repository.AdminRepository;
import com.dmes.pfeBackend.repository.DoctorRepository;
import com.dmes.pfeBackend.repository.PatientRepository;
import com.dmes.pfeBackend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final ContractService contractService;

    public UserService(UserRepository userRepository, 
                      PatientRepository patientRepository,
                      DoctorRepository doctorRepository,
                      AdminRepository adminRepository,
                      PasswordEncoder passwordEncoder, 
                      ContractService contractService) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.contractService = contractService;
    }

    @Transactional
    public User registerUser(RegistrationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role specified");
        }

        User user;
        
        // Create the appropriate user type based on role
        switch (role) {
            case PATIENT:
                Patient patient = new Patient();
                patient.setMedicalRecordNumber(request.getMedicalRecordNumber());
                patient.setDateOfBirth(request.getDateOfBirth());
                patient.setBloodGroup(request.getBloodGroup());
                patient.setAllergies(request.getAllergies());
                patient.setChronicConditions(request.getChronicConditions());
                patient.setEmergencyContact(request.getEmergencyContact());
                user = patient;
                break;
                
            case DOCTOR:
                Doctor doctor = new Doctor();
                doctor.setLicenseNumber(request.getLicenseNumber());
                doctor.setSpecialization(request.getSpecialization());
                doctor.setHospitalAffiliation(request.getHospitalAffiliation());
                doctor.setProfessionalBio(request.getProfessionalBio());
                doctor.setOfficeHours(request.getOfficeHours());
                user = doctor;
                break;
                
            case ADMIN:
                Admin admin = new Admin();
                admin.setDepartment(request.getDepartment());
                admin.setSecurityClearanceLevel(request.getSecurityClearanceLevel());
                admin.setEmergencyAccessGrantor(request.getEmergencyAccessGrantor());
                user = admin;
                break;
                
            default:
                throw new RuntimeException("Unsupported role: " + role);
        }
        
        // Set common fields
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());  // Set the email field
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setActive(true);
        
        // Set wallet address if provided
        if (request.getWalletAddress() != null && !request.getWalletAddress().isEmpty()) {
            user.setWalletAddress(request.getWalletAddress());
        }
        
        // Save user to database
        User savedUser = saveUser(user);
        
        // Register user on blockchain if wallet address is provided
        if (savedUser.getWalletAddress() != null && !savedUser.getWalletAddress().isEmpty()) {
            try {
                contractService.registerUser(
                    savedUser.getId(), 
                    savedUser.getWalletAddress(), 
                    role == Role.DOCTOR,
                    role == Role.ADMIN
                ).join();  // Wait for completion
            } catch (Exception e) {
                System.err.println("Error registering user on blockchain: " + e.getMessage());
            }
        }
        
        return savedUser;
    }

    @Transactional
    public User linkWallet(String userId, String walletAddress) {
        User user = findUserById(userId);
        user.setWalletAddress(walletAddress);
        
        // Register on blockchain
        boolean isDoctor = user.getRole() == Role.DOCTOR;
        boolean isAdmin = user.getRole() == Role.ADMIN;
        
        try {
            contractService.registerUser(
                userId, 
                walletAddress,
                isDoctor,
                isAdmin
            ).join(); // Wait for completion
        } catch (Exception ex) {
            throw new RuntimeException("Failed to register user on blockchain", ex);
        }
        
        return saveUser(user);
    }

    @Transactional
    public User updateUserStatus(UserStatusUpdateRequest request) {
        User user = findUserById(request.getUserId());
        user.setActive(request.getIsActive());
        
        return saveUser(user);
    }

    /**
     * Update a patient's profile information
     */
    @Transactional
    public Patient updatePatientProfile(String userId, Patient updatedPatient) {
        Patient patient = findPatientByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + userId));
        
        // Only update fields that are provided and keep existing data for others
        if (updatedPatient.getMedicalRecordNumber() != null) {
            patient.setMedicalRecordNumber(updatedPatient.getMedicalRecordNumber());
        }
        if (updatedPatient.getDateOfBirth() != null) {
            patient.setDateOfBirth(updatedPatient.getDateOfBirth());
        }
        if (updatedPatient.getBloodGroup() != null) {
            patient.setBloodGroup(updatedPatient.getBloodGroup());
        }
        if (updatedPatient.getAllergies() != null) {
            patient.setAllergies(updatedPatient.getAllergies());
        }
        if (updatedPatient.getChronicConditions() != null) {
            patient.setChronicConditions(updatedPatient.getChronicConditions());
        }
        if (updatedPatient.getEmergencyContact() != null) {
            patient.setEmergencyContact(updatedPatient.getEmergencyContact());
        }
        
        return patientRepository.save(patient);
    }

    /**
     * Update a doctor's profile information
     */
    @Transactional
    public Doctor updateDoctorProfile(String userId, Doctor updatedDoctor) {
        Doctor doctor = findDoctorByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + userId));
        
        if (updatedDoctor.getLicenseNumber() != null) {
            doctor.setLicenseNumber(updatedDoctor.getLicenseNumber());
        }
        if (updatedDoctor.getSpecialization() != null) {
            doctor.setSpecialization(updatedDoctor.getSpecialization());
        }
        if (updatedDoctor.getHospitalAffiliation() != null) {
            doctor.setHospitalAffiliation(updatedDoctor.getHospitalAffiliation());
        }
        if (updatedDoctor.getProfessionalBio() != null) {
            doctor.setProfessionalBio(updatedDoctor.getProfessionalBio());
        }
        if (updatedDoctor.getOfficeHours() != null) {
            doctor.setOfficeHours(updatedDoctor.getOfficeHours());
        }
        
        return doctorRepository.save(doctor);
    }

    /**
     * Update an admin's profile information
     */
    @Transactional
    public Admin updateAdminProfile(String userId, Admin updatedAdmin) {
        Admin admin = findAdminByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Admin not found with ID: " + userId));
        
        if (updatedAdmin.getDepartment() != null) {
            admin.setDepartment(updatedAdmin.getDepartment());
        }
        if (updatedAdmin.getSecurityClearanceLevel() != null) {
            admin.setSecurityClearanceLevel(updatedAdmin.getSecurityClearanceLevel());
        }
        if (updatedAdmin.getEmergencyAccessGrantor() != admin.getEmergencyAccessGrantor()) {
            admin.setEmergencyAccessGrantor(updatedAdmin.getEmergencyAccessGrantor());
        }
        
        return adminRepository.save(admin);
    }

    /**
     * Change a user's password
     */
    @Transactional
    public void changePassword(String userId, String currentPassword, String newPassword) {
        User user = findUserById(userId);
        
        // Verify the current password
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Update to the new password
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        saveUser(user);
    }

    /**
     * Find all users with pagination
     */
    public Page<User> findAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
    
    /**
     * Find all users by role with pagination
     */
    public Page<User> findUsersByRole(Role role, Pageable pageable) {
        return userRepository.findByRole(role, pageable);
    }
    
    /**
     * Find all doctors with pagination
     */
    public Page<Doctor> findAllDoctors(Pageable pageable) {
        return doctorRepository.findAll(pageable);
    }
    
    /**
     * Find all patients with pagination
     */
    public Page<Patient> findAllPatients(Pageable pageable) {
        return patientRepository.findAll(pageable);
    }
    
    /**
     * Find all admins with pagination
     */
    public Page<Admin> findAllAdmins(Pageable pageable) {
        return adminRepository.findAll(pageable);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    public Optional<User> findByUserId(String userId) {
        return userRepository.findById(userId);
    }
    
    public Optional<Patient> findPatientByUserId(String userId) {
        return patientRepository.findById(userId);
    }
    
    public Optional<Doctor> findDoctorByUserId(String userId) {
        return doctorRepository.findById(userId);
    }
    
    public Optional<Admin> findAdminByUserId(String userId) {
        return adminRepository.findById(userId);
    }
    
    /**
     * Helper method to find user by ID and throw exception if not found
     */
    private User findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));
    }
    
    /**
     * Helper method to save a user based on its type
     */
    private User saveUser(User user) {
        if (user instanceof Patient) {
            return patientRepository.save((Patient) user);
        } else if (user instanceof Doctor) {
            return doctorRepository.save((Doctor) user);
        } else if (user instanceof Admin) {
            return adminRepository.save((Admin) user);
        } else {
            return userRepository.save(user);
        }
    }
    
    /**
     * Delete a user (logical deletion by setting active = false)
     */
    @Transactional
    public void deleteUser(String userId) {
        User user = findUserById(userId);
        user.setActive(false);
        saveUser(user);
    }
    
    /**
     * Find a user by wallet address
     */
    public Optional<User> findByWalletAddress(String walletAddress) {
        return userRepository.findByWalletAddress(walletAddress);
    }


    public ProfileResponse getUserProfile(String userId) {
        User user = findUserById(userId);
        
        ProfileResponse profile = new ProfileResponse();
        profile.setUserId(user.getId());
        profile.setUsername(user.getUsername());
        profile.setRole(user.getRole().toString());
        profile.setWalletAddress(user.getWalletAddress());
        profile.setActive(user.isActive());
        
        // Add role-specific details based on user type
        switch (user.getRole()) {
            case DOCTOR:
                Doctor doctor = (Doctor) user;
                profile.setLicenseNumber(doctor.getLicenseNumber());
                profile.setSpecialization(doctor.getSpecialization());
                profile.setHospitalAffiliation(doctor.getHospitalAffiliation());
                profile.setProfessionalBio(doctor.getProfessionalBio());
                profile.setOfficeHours(doctor.getOfficeHours());
                break;
            case PATIENT:
                Patient patient = (Patient) user;
                profile.setDateOfBirth(patient.getDateOfBirth());
                profile.setBloodGroup(patient.getBloodGroup());
                profile.setAllergies(patient.getAllergies());
                profile.setChronicConditions(patient.getChronicConditions());
                profile.setEmergencyContact(patient.getEmergencyContact());
                break;
            case ADMIN:
                Admin admin = (Admin) user;
                profile.setDepartment(admin.getDepartment());
                profile.setSecurityClearanceLevel(admin.getSecurityClearanceLevel());
                profile.setEmergencyAccessGrantor(admin.getEmergencyAccessGrantor());
                break;
        }
        
        return profile;
    }
    public ProfileResponse getUserProfileByUsername(String username) {
        User user = findByUsername(username);
        return getUserProfile(user.getId()); // Use your existing method
    }


    @Transactional
    public User registerDoctor(DoctorRegistrationRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        // Check if email already exists
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create a new Doctor
        Doctor doctor = new Doctor();
        doctor.setUsername(request.getUsername());
        doctor.setEmail(request.getEmail());
        doctor.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        doctor.setRole(Role.DOCTOR);
        doctor.setActive(true);
        
        // Set doctor-specific fields
        doctor.setLicenseNumber(request.getLicenseNumber());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setHospitalAffiliation(request.getHospitalAffiliation());
        doctor.setProfessionalBio(request.getProfessionalBio());
        doctor.setOfficeHours(request.getOfficeHours());
        
        // Set wallet address if provided
        if (request.getWalletAddress() != null && !request.getWalletAddress().isEmpty()) {
            doctor.setWalletAddress(request.getWalletAddress());
        }
        
        // Save doctor to database
        Doctor savedDoctor = doctorRepository.save(doctor);
        
        // Register doctor on blockchain if wallet address is provided
        if (savedDoctor.getWalletAddress() != null && !savedDoctor.getWalletAddress().isEmpty()) {
            try {
                contractService.registerUser(
                    savedDoctor.getId(), 
                    savedDoctor.getWalletAddress(), 
                    true, // isDoctor
                    false // isAdmin
                ).join();  // Wait for completion
            } catch (Exception e) {
                // Log the error but don't fail the registration
                System.err.println("Error registering doctor on blockchain: " + e.getMessage());
            }
        }
        
        return savedDoctor;
    }

   
    public List<Doctor> findAllDoctors() {
        // TODO Auto-generated method stub
        return doctorRepository.findAll();
    }
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User registerPatient(PatientRegistrationRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        // Check if email already exists
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create a new Patient
        Patient patient = new Patient();
        patient.setUsername(request.getUsername());
        patient.setEmail(request.getEmail());
        patient.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        patient.setRole(Role.PATIENT);
        patient.setActive(true);
        
        // Set patient-specific fields
        patient.setMedicalRecordNumber(request.getMedicalRecordNumber());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setAllergies(request.getAllergies());
        patient.setChronicConditions(request.getChronicConditions());
        patient.setEmergencyContact(request.getEmergencyContact());
        
        // Set wallet address if provided
        if (request.getWalletAddress() != null && !request.getWalletAddress().isEmpty()) {
            patient.setWalletAddress(request.getWalletAddress());
        }
        
        // Save patient to database
        Patient savedPatient = patientRepository.save(patient);
        
        // Register patient on blockchain if wallet address is provided
        if (savedPatient.getWalletAddress() != null && !savedPatient.getWalletAddress().isEmpty()) {
            try {
                contractService.registerUser(
                    savedPatient.getId(), 
                    savedPatient.getWalletAddress(), 
                    false, // isDoctor
                    false  // isAdmin
                ).join();  // Wait for completion
            } catch (Exception e) {
                // Log the error but don't fail the registration
                System.err.println("Error registering patient on blockchain: " + e.getMessage());
            }
        }
        
        return savedPatient;
    }
    public Optional<Patient> findPatientById(String id) {
        return patientRepository.findById(id);
    }
}
