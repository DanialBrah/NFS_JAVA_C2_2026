package com.example.supportdesk.service;

import com.example.supportdesk.dto.AuthResponse;
import com.example.supportdesk.dto.LoginRequest;
import com.example.supportdesk.dto.RegisterRequest;
import com.example.supportdesk.exception.DuplicateEmailException;
import com.example.supportdesk.exception.InvalidCredentialsException;
import com.example.supportdesk.model.AppUser;
import com.example.supportdesk.repository.AppUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());

        if (appUserRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateEmailException("Email already exists: " + email);
        }

        AppUser user = new AppUser(
                request.getName().trim(),
                email,
                passwordEncoder.encode(request.getPassword()),
                "USER"
        );

        AppUser savedUser = appUserRepository.save(user);
        logger.info("Registered new user email={} role={}", savedUser.getEmail(), savedUser.getRole());

        return buildAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());

        AppUser user = appUserRepository.findByEmailIgnoreCase(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        logger.info("User logged in email={} role={}", user.getEmail(), user.getRole());

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(AppUser user) {
        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                "Bearer",
                jwtService.getExpirationMinutes(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
