package com.dmes.pfeBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PfeBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PfeBackendApplication.class, args);
		System.out.println("server is running");
	}
}
