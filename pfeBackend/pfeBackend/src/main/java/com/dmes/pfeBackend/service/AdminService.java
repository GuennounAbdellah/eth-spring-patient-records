package com.dmes.pfeBackend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dmes.pfeBackend.exception.ResourceNotFoundException;
import com.dmes.pfeBackend.model.Admin;
import com.dmes.pfeBackend.repository.AdminRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Service layer for Admin entity operations.
 * This class implements the business logic for admin management operations.
 * It serves as an intermediary layer between the controller and repository layers.
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class AdminService {

    private final AdminRepository adminRepository;

    /**
     * Constructor-based dependency injection (preferred over field injection)
     * @param adminRepository JPA repository for Admin entity
     */
    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    /**
     * Retrieves a paginated list of admins sorted by creation date.
     * 
     * @param page Zero-based page index
     * @param size The size of the page to be returned
     * @return Page<Admin> containing:
     *         - List of admins for the requested page
     *         - Pagination metadata (total pages, elements, etc.)
     */
    public Page<Admin> getAllAdmins(int page, int size) {
        log.debug("Fetching admins page {} with size {}", page, size);
        PageRequest pageable = PageRequest.of(
            page,
            size,
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return adminRepository.findAll(pageable);
    }

    /**
     * Retrieves the 10 most recently created admins.
     * 
     * @return Page<Admin> containing the 10 most recent admins
     */
    public Page<Admin> findLast10Admins() {
        log.debug("Fetching last 10 admins");
        return adminRepository.findAll(
            PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
    }

    
    /**
     * Retrieves a specific admin by their ID.
     * 
     * @param id The admin's unique identifier
     * @return Admin entity if found
     * @throws ResourceNotFoundException if admin is not found
     */
    public Admin getAdminById(Long id) {
        log.debug("Fetching admin with id: {}", id);
        return adminRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Admin not found with id: " + id
            ));
    }

    /**
     * Creates a new admin or updates an existing one.
     * 
     * @param admin The admin entity to be saved
     * @return The saved admin entity with generated ID for new admins
     */
    @Transactional
    public Admin saveAdmin(Admin admin) {
        log.debug("Saving admin: {}", admin);
        return adminRepository.save(admin);
    }

    /**
     * Deletes an admin by their ID.
     * 
     * @param id The admin's unique identifier
     * @throws ResourceNotFoundException if admin is not found
     */
    @Transactional
    public void deleteAdmin(Long id) {
        log.debug("Deleting admin with id: {}", id);
        if (!adminRepository.existsById(id)) {
            throw new ResourceNotFoundException("Admin not found with id: " + id);
        }
        adminRepository.deleteById(id);
    }
}
