package com.dmes.pfeBackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Doctor extends User {
    
    @Column
    private String licenseNumber;
    
    @Column
    private String specialization;
    
    @Column
    private String hospitalAffiliation;
    
    @Column(length = 1000)
    private String professionalBio;
    
    @Column
    private String officeHours;
}