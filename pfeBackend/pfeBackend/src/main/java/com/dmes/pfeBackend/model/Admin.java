package com.dmes.pfeBackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
//	import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;


/**
 * User entity representing the user table in the database.
 * Uses Lombok annotations to reduce boilerplate code and includes
 * proper validation constraints for all fields.
 */
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Column(name = "last_name", nullable = false)
    private String nom;
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Column(name = "first_name", nullable = false)
    private String prenom;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "password is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Column(name = "password", nullable = false)
    private String password;
    
    @NotBlank(message = "Nom Hopital is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Column(name = "nomHopital", nullable = false)
    private String nomHopital;
    
    @NotBlank(message = "role is required")
    @Size(min = 2, max = 50, message = "Role must be between 2 and 50 characters")
    @Column(name = "role", nullable = false)
    private String role;
    
    
    @NotBlank(message = "Ville requierd ")
    @Size(min = 2, max = 50, message = "Password must be between 2 and 50 characters")
    @Column(name = "ville", nullable = false)
    private String ville;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;


    
/*    @Column(name = "firt_login", nullable = false)
    @Builder.Default
    private boolean firstLogin = true;
*/
    /*
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
     */
    /**
     * Custom toString method to exclude potentially sensitive information
     */

}
