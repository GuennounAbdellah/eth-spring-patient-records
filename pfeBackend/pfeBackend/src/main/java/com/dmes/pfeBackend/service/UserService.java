package com.dmes.pfeBackend.service;

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
    // 100%
    @Transactional
    public User registerUser(RegistrationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + request.getRole());
        }

        User user;
        
        // Create the appropriate user type based on role
        switch (role) {
            case PATIENT:
                Patient patient = new Patient();
                // Set patient-specific fields if provided in request
                if (request.getMedicalRecordNumber() != null) {
                    patient.setMedicalRecordNumber(request.getMedicalRecordNumber());
                }
                if (request.getDateOfBirth() != null) {
                    patient.setDateOfBirth(request.getDateOfBirth());
                }
                if (request.getBloodGroup() != null) {
                    patient.setBloodGroup(request.getBloodGroup());
                }
                if (request.getAllergies() != null) {
                    patient.setAllergies(request.getAllergies());
                }
                if (request.getChronicConditions() != null) {
                    patient.setChronicConditions(request.getChronicConditions());
                }
                if (request.getEmergencyContact() != null) {
                    patient.setEmergencyContact(request.getEmergencyContact());
                }
                user = patient;
                break;
                
            case DOCTOR:
                Doctor doctor = new Doctor();
                // Set doctor-specific fields if provided in request
                if (request.getLicenseNumber() != null) {
                    doctor.setLicenseNumber(request.getLicenseNumber());
                }
                if (request.getSpecialization() != null) {
                    doctor.setSpecialization(request.getSpecialization());
                }
                if (request.getHospitalAffiliation() != null) {
                    doctor.setHospitalAffiliation(request.getHospitalAffiliation());
                }
                if (request.getProfessionalBio() != null) {
                    doctor.setProfessionalBio(request.getProfessionalBio());
                }
                if (request.getOfficeHours() != null) {
                    doctor.setOfficeHours(request.getOfficeHours());
                }
                user = doctor;
                break;
                
            case ADMIN:
                Admin admin = new Admin();
                // Set admin-specific fields if provided in request
                if (request.getDepartment() != null) {
                    admin.setDepartment(request.getDepartment());
                }
                if (request.getSecurityClearanceLevel() != null) {
                    admin.setSecurityClearanceLevel(request.getSecurityClearanceLevel());
                }
                if (request.getEmergencyAccessGrantor() != null) {
                    admin.setEmergencyAccessGrantor(request.getEmergencyAccessGrantor());
                }
                user = admin;
                break;
                
            default:
                throw new RuntimeException("Unsupported role: " + role);
        }
        
        // Set common fields
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setActive(true);
        
        // Save user to get ID
        User savedUser;
        
        if (user instanceof Patient) {
            savedUser = patientRepository.save((Patient) user);
        } else if (user instanceof Doctor) {
            savedUser = doctorRepository.save((Doctor) user);
        } else if (user instanceof Admin) {
            savedUser = adminRepository.save((Admin) user);
        } else {
            savedUser = userRepository.save(user);
        }
        
        // If wallet address is provided, register on blockchain
        String walletAddress = request.getWalletAddress();
        if (walletAddress != null && !walletAddress.isEmpty()) {
            user.setWalletAddress(walletAddress);
            
            boolean isDoctor = role == Role.DOCTOR;
            boolean isAdmin = role == Role.ADMIN;
            
            try {
                contractService.registerUser(
                    savedUser.getId(), 
                    walletAddress,
                    isDoctor,
                    isAdmin
                ).join(); // Wait for completion
            } catch (Exception ex) {
                throw new RuntimeException("Failed to register user on blockchain", ex);
            }
            
            // Update with wallet address
            if (savedUser instanceof Patient) {
                savedUser = patientRepository.save((Patient) savedUser);
            } else if (savedUser instanceof Doctor) {
                savedUser = doctorRepository.save((Doctor) savedUser);
            } else if (savedUser instanceof Admin) {
                savedUser = adminRepository.save((Admin) savedUser);
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
}