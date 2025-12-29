// src/main/java/com/fixify/controller/AdminController.java
package com.fixify.controller;

import com.fixify.model.Issue;
import com.fixify.model.TimelineEvent;
import com.fixify.model.User;
import com.fixify.repository.UserRepository;
import com.fixify.service.IssueService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminController {

    private final UserRepository userRepository;
    private final IssueService issueService;

    public AdminController(
            UserRepository userRepository,
            IssueService issueService
    ) {
        this.userRepository = userRepository;
        this.issueService = issueService;
    }

    // ============================================================
    // 👤 USER MANAGEMENT
    // ============================================================

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{username}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable String username,
            @RequestBody Map<String, String> body
    ) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "User not found"));
        }

        String role = body.get("role");

        if (role == null || !List.of("USER", "ADMIN").contains(role)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid role"));
        }

        user.setRole(role);
        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Role updated successfully",
                        "username", username,
                        "role", role
                )
        );
    }

    @DeleteMapping("/users/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        if (!userRepository.existsByUsername(username)) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "User not found"));
        }

        userRepository.deleteByUsername(username);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    // ============================================================
    // 🛠 ISSUE MANAGEMENT
    // ============================================================

    @GetMapping("/issues")
    public ResponseEntity<List<Issue>> getAllIssues() {
        return ResponseEntity.ok(issueService.getAll());
    }

    @PutMapping("/issues/{id}/status")
    public ResponseEntity<?> updateIssueStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        if (!body.containsKey("status")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Status is required"));
        }

        String status = body.get("status").toUpperCase();
        String updatedBy = body.getOrDefault("updatedBy", "ADMIN");

        // ✅ Allowed statuses
        List<String> allowedStatuses = List.of("NEW", "IN_PROGRESS", "FIXED");
        if (!allowedStatuses.contains(status)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid status value"));
        }

        Issue updated = issueService.updateStatus(id, status, updatedBy);
        if (updated == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Issue not found"));
        }

        return ResponseEntity.ok(updated);
    }

    @PutMapping("/issues/{id}/assign")
    public ResponseEntity<?> assignIssue(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        String assignedTo = body.get("assignedTo");
        if (assignedTo == null || assignedTo.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "assignedTo is required"));
        }

        String assignedBy = body.getOrDefault("assignedBy", "ADMIN");

        Issue updated = issueService.assignIssue(id, assignedTo, assignedBy);
        if (updated == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Issue not found"));
        }

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/issues/{id}")
    public ResponseEntity<?> deleteIssue(@PathVariable String id) {
        Issue issue = issueService.getAll()
                .stream()
                .filter(i -> i.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (issue == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Issue not found"));
        }

        issueService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Issue deleted"));
    }

    // ============================================================
    // 🕒 TIMELINE & COMMENTS
    // ============================================================

    @GetMapping("/issues/{id}/timeline")
    public ResponseEntity<List<TimelineEvent>> getTimeline(@PathVariable String id) {
        return ResponseEntity.ok(issueService.getTimeline(id));
    }

    @PostMapping("/issues/{id}/comment")
    public ResponseEntity<?> addComment(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        String message = body.get("message");
        if (message == null || message.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Message is required"));
        }

        String username = body.getOrDefault("username", "ADMIN");

        Issue updated = issueService.addComment(id, message, username);
        if (updated == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Issue not found"));
        }

        return ResponseEntity.ok(updated);
    }

    // ============================================================
    // 📊 ANALYTICS
    // ============================================================

    @GetMapping("/analytics/summary")
    public ResponseEntity<?> analyticsSummary() {

        List<Issue> issues = issueService.getAll();

        long newCount =
                issues.stream().filter(i -> "NEW".equals(i.getStatus())).count();
        long inProgress =
                issues.stream().filter(i -> "IN_PROGRESS".equals(i.getStatus())).count();
        long fixed =
                issues.stream().filter(i -> "FIXED".equals(i.getStatus())).count();

        return ResponseEntity.ok(
                Map.of(
                        "total", issues.size(),
                        "new", newCount,
                        "inProgress", inProgress,
                        "fixed", fixed
                )
        );
    }
}
