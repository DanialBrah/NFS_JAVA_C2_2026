package com.example.supportdesk.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.supportdesk.model.AppUser;
import com.example.supportdesk.repository.AppUserRepository;

@Configuration
public class UserDataSeeder {

    @Bean
    CommandLineRunner seedAdminUser(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (appUserRepository.existsByEmailIgnoreCase("admin@example.com")) {
                return;
            }

            appUserRepository.save(new AppUser(
                    "Admin User",
                    "admin@example.com",
                    passwordEncoder.encode("Admin@12345"),
                    "ADMIN"
            ));
        };
    }
}
