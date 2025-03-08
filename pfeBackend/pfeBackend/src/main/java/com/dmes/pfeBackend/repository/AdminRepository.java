package com.dmes.pfeBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dmes.pfeBackend.model.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
	
}