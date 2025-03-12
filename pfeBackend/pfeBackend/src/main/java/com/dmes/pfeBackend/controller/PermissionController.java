package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.dto.AccessPermissionRequest;
import com.dmes.pfeBackend.service.PermissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @PostMapping("/grant-access")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public CompletableFuture<ResponseEntity<String>> grantAccess(
            @RequestBody AccessPermissionRequest request
    ) {
        return permissionService.grantAccess(request)
                .thenApply(ResponseEntity::ok);
    }

    @PostMapping("/remove-access")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public CompletableFuture<ResponseEntity<String>> removeAccess(
            @RequestBody AccessPermissionRequest request
    ) {
        return permissionService.removeAccess(request)
                .thenApply(ResponseEntity::ok);
    }
}