package com.dmes.pfeBackend.config;

import com.dmes.pfeBackend.security.JwtAuthorizationFilter;
import com.dmes.pfeBackend.security.JwtTokenProvider;
import com.dmes.pfeBackend.service.UserDetailsServiceImpl;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private JwtAuthorizationFilter jwtAuthorizationFilter;
    private final AuthenticationConfiguration authenticationConfiguration;
	private UserDetailsServiceImpl userDetailsService;
	private com.dmes.pfeBackend.security.JwtTokenProvider jwtTokenProvider;
    @Autowired
    public void JwtTokenProvider(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }
    
    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration,
                          JwtTokenProvider jwtTokenProvider) {
        this.authenticationConfiguration = authenticationConfiguration;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    	http
	        .csrf(AbstractHttpConfigurer::disable)
	        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(STATELESS)) // Use stateless sessions
            .authorizeHttpRequests(auth -> auth
            	    .requestMatchers("/api/auth/**").permitAll()
            	    .requestMatchers("/api/admin/**").hasRole("ADMIN")
            	    .requestMatchers("/api/doctors/**").hasRole("DOCTOR")
            	    .requestMatchers("/api/patients/**").hasRole("PATIENT")
            	    .anyRequest().authenticated()
            	)
            .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Your frontend URL
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}