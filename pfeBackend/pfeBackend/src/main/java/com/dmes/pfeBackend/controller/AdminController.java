package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.dto.ProfileResponse;
import com.dmes.pfeBackend.model.Role;
import com.dmes.pfeBackend.model.User;
import com.dmes.pfeBackend.service.UserService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.findAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error retrieving users",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/users/by-role")
    public ResponseEntity<?> getUsersByRole(@RequestParam String role) {
        try {
            // Handle ALL as a special case
            if ("ALL".equalsIgnoreCase(role)) {
                List<User> users = userService.findAllUsers();
                return ResponseEntity.ok(users);
            }
            
            // Parse the role
            Role userRole;
            try {
                userRole = Role.valueOf(role.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid role",
                    "details", "Role must be one of: PATIENT, DOCTOR, ADMIN"
                ));
            }
            
            // Get users by role
            List<User> users = userService.findUsersByRole(userRole, Pageable.unpaged()).getContent();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error retrieving users by role",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserDetails(@PathVariable String id) {
        try {
            ProfileResponse profile = userService.getUserProfile(id);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error retrieving user details",
                "details", e.getMessage()
            ));
        }
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> statusUpdate) {
        try {
            Boolean isActive = statusUpdate.get("isActive");
            if (isActive == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Missing isActive field"
                ));
            }
            
            User updatedUser = userService.updateUserStatus(new com.dmes.pfeBackend.dto.UserStatusUpdateRequest() {{
                setUserId(id);
                setIsActive(isActive);
            }});
            
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error updating user status",
                "details", e.getMessage()
            ));
        }
    }
}