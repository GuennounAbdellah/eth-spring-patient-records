package com.dmes.pfeBackend.model;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.*;
import lombok.Data;



@Data
@Entity
@Table(name = "app_users") // Avoid SQL keywords
public abstract class User {
    
	@Id
	@GeneratedValue(generator = "uuid2")
	@GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
	private String id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String passwordHash;
    
    @Column
    private String walletAddress;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @Column(nullable = false)
    private boolean active = true;


}