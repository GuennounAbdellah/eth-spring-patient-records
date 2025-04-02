package com.dmes.pfeBackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Patient extends User {
    
    @Column
    private String medicalRecordNumber;
    
    @Column
    private LocalDate dateOfBirth;
    
    @Column
    private String bloodGroup;
    
    @Column(length = 1000)
    private String allergies;
    
    @Column(length = 1000)
    private String chronicConditions;
    
    @Column
    private String emergencyContact;
}