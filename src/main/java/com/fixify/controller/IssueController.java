package com.fixify.controller;

import com.fixify.model.Issue;
import com.fixify.model.TimelineEvent;
import com.fixify.service.IssueService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/issues")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class IssueController {

    private final IssueService service;
    private final ObjectMapper mapper = new ObjectMapper();

    public IssueController(IssueService service) {
        this.service = service;
    }

    // ============================================================
    // 📥 GET ALL ISSUES (OPTIONAL FILTERS)
    // ============================================================
    @GetMapping
    public List<Issue> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String assignedTo,
            @RequestParam(required = false) String createdBy
    ) {
        if (createdBy != null) {
            return service.getByCreatedBy(createdBy);
        }
        if (assignedTo != null) {
            return service.getByAssignedUser(assignedTo);
        }
        if (status != null) {
            return service.getByStatus(status.toUpperCase());
        }
        return service.getAll();
    }

    // ============================================================
    // 🆕 CREATE ISSUE (JSON + OPTIONAL IMAGE)
    // ============================================================
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Issue> create(
            @RequestPart("issue") String issueJson,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {

        Issue issue = mapper.readValue(issueJson, Issue.class);
        Issue created = service.create(issue, image);

        return ResponseEntity.ok(created);
    }

    // ============================================================
    // 🔄 UPDATE ISSUE STATUS  ✅ JSON BODY (FIXED)
    // ============================================================
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        if (!body.containsKey("status")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "status is required"));
        }

        String status = body.get("status");
        String updatedBy = body.getOrDefault("updatedBy", "SYSTEM");

        Issue updated = service.updateStatus(id, status, updatedBy);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }

    // ============================================================
    // 👷 ASSIGN ISSUE  ✅ JSON BODY (FIXED)
    // ============================================================
    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignIssue(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        if (!body.containsKey("assignedTo")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "assignedTo is required"));
        }

        String assignedTo = body.get("assignedTo");
        String assignedBy = body.getOrDefault("assignedBy", "SYSTEM");

        Issue updated = service.assignIssue(id, assignedTo, assignedBy);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }

    // ============================================================
    // 🕒 GET ISSUE TIMELINE
    // ============================================================
    @GetMapping("/{id}/timeline")
    public List<TimelineEvent> getTimeline(@PathVariable String id) {
        return service.getTimeline(id);
    }

    // ============================================================
    // 💬 ADD COMMENT  ✅ JSON BODY (FIXED ORDER)
    // ============================================================
    @PostMapping("/{id}/comment")
    public ResponseEntity<?> addComment(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        if (!body.containsKey("message")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "message is required"));
        }

        String message = body.get("message");
        String username = body.getOrDefault("username", "SYSTEM");

        Issue updated = service.addComment(id, message, username);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updated);
    }

    // ============================================================
    // 🗑 DELETE ISSUE
    // ============================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(Map.of("message", "Issue deleted"));
    }
}
