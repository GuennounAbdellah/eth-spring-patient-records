package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.dto.UserStatusUpdateRequest;
import com.dmes.pfeBackend.dto.WalletLinkRequest;
import com.dmes.pfeBackend.model.User;
import com.dmes.pfeBackend.security.CurrentUser;
import com.dmes.pfeBackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/link-wallet")
    public ResponseEntity<User> linkWallet(
            @CurrentUser User currentUser,
            @Valid @RequestBody WalletLinkRequest request
    ) {
        User user = userService.linkWallet(currentUser.getUserId(), request.getWalletAddress());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUserStatus(
            @Valid @RequestBody UserStatusUpdateRequest request
    ) {
        User user = userService.updateUserStatus(request);
        return ResponseEntity.ok(user);
    }
}