package com.dmes.pfeBackend.controller;

import com.dmes.pfeBackend.dto.UserStatusUpdateRequest;
import com.dmes.pfeBackend.model.User;
import com.dmes.pfeBackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PutMapping("/status")
    public ResponseEntity<User> updateUserStatus(
            @Valid @RequestBody UserStatusUpdateRequest request
    ) {
        User user = userService.updateUserStatus(request);
        return ResponseEntity.ok(user);
    }
}