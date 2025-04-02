package com.dmes.pfeBackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("Admin")
public class Admin extends User {
    
    @Column
    private String department;
    
    @Column
    private String securityClearanceLevel;
    
    @Column
    private Boolean emergencyAccessGrantor;
}