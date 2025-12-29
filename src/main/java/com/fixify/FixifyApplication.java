package com.fixify;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class FixifyApplication {

    public static void main(String[] args) {
        SpringApplication.run(FixifyApplication.class, args);
    }

    @Bean
    CommandLineRunner generatePassword(PasswordEncoder encoder) {
        return args -> {
            System.out.println("BCrypt(admin123) = " + encoder.encode("admin123"));
        };
    }
}
