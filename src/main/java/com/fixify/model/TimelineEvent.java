package com.fixify.model;

public class TimelineEvent {

    private String type;        // CREATED / STATUS_CHANGED / COMMENT / IMAGE_ADDED
    private String message;     // Description text
    private String createdBy;   // Username
    private long timestamp = System.currentTimeMillis();

    public TimelineEvent() {}

    public TimelineEvent(String type, String message, String createdBy) {
        this.type = type;
        this.message = message;
        this.createdBy = createdBy;
    }

    // Getters & Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
