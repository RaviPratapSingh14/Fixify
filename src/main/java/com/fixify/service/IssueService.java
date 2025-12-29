package com.fixify.service;

import com.fixify.model.Issue;
import com.fixify.model.TimelineEvent;
import com.fixify.repository.IssueRepository;
import com.fixify.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@Service
public class IssueService {

    private final IssueRepository repo;
    private final FileStorageService storage;
    private final UserRepository userRepo;

    // ✅ Allowed statuses (centralized)
    private static final Set<String> ALLOWED_STATUSES =
            Set.of("NEW", "IN_PROGRESS", "FIXED");

    public IssueService(
            IssueRepository repo,
            FileStorageService storage,
            UserRepository userRepo
    ) {
        this.repo = repo;
        this.storage = storage;
        this.userRepo = userRepo;
    }

    // ===============================
    // 📥 GET ISSUES
    // ===============================
    public List<Issue> getAll() {
        return repo.findAll();
    }

    public List<Issue> getByStatus(String status) {
        return repo.findByStatus(status);
    }

    public List<Issue> getByAssignedUser(String username) {
        return repo.findByAssignedTo(username);
    }

    // ===============================
    // 🆕 CREATE ISSUE (WITH IMAGE)
    // ===============================
    public Issue create(Issue issue, MultipartFile image) throws IOException {

        // ✅ Validate coordinates
        if (issue.getLatitude() == null || issue.getLongitude() == null) {
            throw new IllegalArgumentException("Latitude and longitude are required");
        }

        // ✅ Initialize meta
        issue.setStatus("NEW");
        issue.setCreatedAt(System.currentTimeMillis());

        // ✅ IMPORTANT: build GeoJSON point
        issue.updateLocation();

        // 📸 Image upload
        if (image != null && !image.isEmpty()) {
            String url = storage.store(image);
            issue.setImageUrl(url);

            issue.addTimelineEvent(new TimelineEvent(
                    "IMAGE_ADDED",
                    "Image uploaded",
                    issue.getCreatedBy()
            ));
        }

        // 🕒 Timeline
        issue.addTimelineEvent(new TimelineEvent(
                "CREATED",
                "Issue created",
                issue.getCreatedBy()
        ));

        return repo.save(issue);
    }

    // ===============================
    // 🔄 UPDATE STATUS
    // ===============================
    public Issue updateStatus(String id, String status, String updatedBy) {

        Issue issue = repo.findById(id).orElse(null);
        if (issue == null) return null;

        status = status.toUpperCase();

        if (!ALLOWED_STATUSES.contains(status)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        issue.setStatus(status);

        issue.addTimelineEvent(new TimelineEvent(
                "STATUS_CHANGED",
                "Status changed to " + status,
                updatedBy
        ));

        return repo.save(issue);
    }

    // ===============================
    // 👷 ASSIGN ISSUE
    // ===============================
    public Issue assignIssue(String id, String staffUsername, String assignedBy) {

        Issue issue = repo.findById(id).orElse(null);
        if (issue == null) return null;

        // ✅ Optional safety check
        if (!userRepo.existsByUsername(staffUsername)) {
            throw new IllegalArgumentException("Assigned user does not exist");
        }

        issue.setAssignedTo(staffUsername);

        issue.addTimelineEvent(new TimelineEvent(
                "ASSIGNED",
                "Assigned to " + staffUsername,
                assignedBy
        ));

        return repo.save(issue);
    }

    // ===============================
    // 🕒 TIMELINE
    // ===============================
    public List<TimelineEvent> getTimeline(String issueId) {
        Issue issue = repo.findById(issueId).orElse(null);
        return issue != null ? issue.getTimeline() : List.of();
    }

    // ===============================
    // 💬 COMMENTS
    // ===============================
    public Issue addComment(String issueId, String message, String username) {

        Issue issue = repo.findById(issueId).orElse(null);
        if (issue == null) return null;

        issue.addTimelineEvent(new TimelineEvent(
                "COMMENT",
                message,
                username
        ));

        return repo.save(issue);
    }

    // ===============================
    // 🗑 DELETE
    // ===============================
    public void delete(String id) {
        repo.deleteById(id);
    }
}
