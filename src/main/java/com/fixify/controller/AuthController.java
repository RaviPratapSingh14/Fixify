package com.fixify.controller;

import com.fixify.model.User;
import com.fixify.repository.UserRepository;
import com.fixify.security.JwtUtil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    // ✅ Inject admin secret from properties
    @Value("${fixify.admin.secret}")
    private String adminSecret;

    public AuthController(
            UserRepository userRepo,
            PasswordEncoder encoder,
            JwtUtil jwtUtil
    ) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    // ===============================
    // SIGNUP
    // ===============================
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> req) {

        if (userRepo.existsByUsername(req.get("username"))) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username already exists"));
        }

        User user = new User();
        user.setUsername(req.get("username"));
        user.setEmail(req.get("email"));
        user.setPassword(encoder.encode(req.get("password")));

        // 🔐 Secure role assignment
        if ("ADMIN".equalsIgnoreCase(req.get("role"))) {

            if (!adminSecret.equals(req.get("adminSecret"))) {
                return ResponseEntity.status(403)
                        .body(Map.of("message", "Invalid admin secret"));
            }

            user.setRole("ADMIN");

        } else {
            user.setRole("USER");
        }

        userRepo.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Signup successful",
                        "role", user.getRole()
                )
        );
    }

    // ===============================
    // LOGIN
    // ===============================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {

        User user = userRepo.findByUsername(req.get("username"));

        if (user == null || !encoder.matches(
                req.get("password"), user.getPassword()
        )) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole()
        );

        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "username", user.getUsername(),
                        "role", user.getRole()
                )
        );
    }
}
