package com.dmes.pfeBackend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "app_users")
public abstract class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String passwordHash;
    
    @Column(unique = true)
    private String email;
    
    @Column
    private String walletAddress;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @Column(nullable = false)
    private boolean active = true;
}