package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.model.Admin;
import com.dmes.pfeBackend.service.AdminService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * REST Controller for managing Admin entities.
 * Provides endpoints for CRUD operations on admins with proper error handling and validation.
 */
@Slf4j
@RestController
@Validated
@Tag(name = "Admin Management API", description = "Endpoints for managing admin operations")
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/admins", produces = "application/json")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Retrieve a paginated list of admins.
     * 
     * @param page Page number (0-based)
     * @param size Number of items per page
     * @return ResponseEntity containing Page of admins with metadata
     */
    @Operation(
        summary = "Get paginated list of admins",
        description = "Returns a page of admins sorted by creation date (descending)"
    )
    @ApiResponse(responseCode = "200", description = "Successfully retrieved admins")
    @GetMapping
    public ResponseEntity<Page<Admin>> getAllAdmins(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @Parameter(description = "Number of items per page")
            @RequestParam(defaultValue = "10") @Min(1) int size) {
        log.debug("REST request to get admins page {} with size {}", page, size);
        return ResponseEntity.ok(adminService.getAllAdmins(page, size));
    }

    /**
     * Retrieve the 10 most recently created admins.
     * 
     * @return ResponseEntity containing Page of 10 most recent admins
     */
    @Operation(summary = "Get latest 10 admins")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved latest admins")
    @GetMapping("/latest")
    public ResponseEntity<Page<Admin>> getLast10Admins() {
        log.debug("REST request to get last 10 admins");
        return ResponseEntity.ok(adminService.findLast10Admins());
    }

    /**
     * Retrieve a specific admin by ID.
     * 
     * @param id Admin ID
     * @return ResponseEntity containing the requested admin
     */
    @Operation(summary = "Get admin by ID")
    @ApiResponse(responseCode = "200", description = "Admin found")
    @ApiResponse(responseCode = "404", description = "Admin not found")
    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(
            @Parameter(description = "ID of the admin to retrieve")
            @PathVariable Long id) {
        log.debug("REST request to get Admin : {}", id);
        return ResponseEntity.ok(adminService.getAdminById(id));
    }

    /**
     * Create a new admin.
     * 
     * @param admin Admin entity to create
     * @return ResponseEntity containing the created admin
     */
    @Operation(summary = "Create a new admin")
    @ApiResponse(responseCode = "201", description = "Admin created successfully")
    @PostMapping(consumes = "application/json")
    public ResponseEntity<Admin> createAdmin(@Valid @RequestBody Admin admin) {
        log.debug("REST request to save Admin : {}", admin);
        if (admin.getId() != null) {
            throw new IllegalArgumentException("A new admin cannot already have an ID");
        }
        Admin result = adminService.saveAdmin(admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    /**
     * Fully update an existing admin.
     * 
     * @param id Admin ID
     * @param adminDetails Updated admin details
     * @return ResponseEntity containing the updated admin
     */
    @Operation(summary = "Update an existing admin")
    @ApiResponse(responseCode = "200", description = "Admin updated successfully")
    @ApiResponse(responseCode = "404", description = "Admin not found")
    @PutMapping(value = "/{id}", consumes = "application/json")
    public ResponseEntity<Admin> updateAdmin(
            @PathVariable Long id,
            @Valid @RequestBody Admin adminDetails) {
        log.debug("REST request to update Admin : {}", adminDetails);
        if (adminDetails.getId() == null) {
            adminDetails.setId(id);
        } else if (!id.equals(adminDetails.getId())) {
            throw new IllegalArgumentException("ID in path and body must match");
        }
        Admin result = adminService.saveAdmin(adminDetails);
        return ResponseEntity.ok(result);
    }

    /**
     * Delete an admin by ID.
     * 
     * @param id Admin ID
     * @return ResponseEntity with no content
     */
    @Operation(summary = "Delete an admin")
    @ApiResponse(responseCode = "204", description = "Admin deleted successfully")
    @ApiResponse(responseCode = "404", description = "Admin not found")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        log.debug("REST request to delete Admin : {}", id);
        adminService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }
}
