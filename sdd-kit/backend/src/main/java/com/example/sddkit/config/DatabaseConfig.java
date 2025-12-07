package com.example.sddkit.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.example.sddkit.infrastructure.repository")
public class DatabaseConfig {
}