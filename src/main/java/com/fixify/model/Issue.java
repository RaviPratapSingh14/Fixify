package com.fixify.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "issues")
public class Issue {

    @Id
    private String id;

    // ===============================
    // CORE ISSUE DETAILS
    // ===============================
    private String title;
    private String description;
    private String address;
    private String landmark;

    // ✅ Use Double (NOT double)
    private Double latitude;
    private Double longitude;

    // ✅ GeoJSON point for future heatmap / clustering
    @GeoSpatialIndexed(type = org.springframework.data.mongodb.core.index.GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location;

    // ===============================
    // USER DETAILS
    // ===============================
    private String createdBy;
    private String contact;
    private Boolean anonymous = false;

    // ===============================
    // ISSUE META
    // ===============================
    private String status = "NEW";        // NEW | IN_PROGRESS | FIXED
    private String category = "General";
    private String priority = "Medium";

    private String assignedTo;
    private String imageUrl;

    private Long createdAt = System.currentTimeMillis();

    // ===============================
    // TIMELINE
    // ===============================
    private List<TimelineEvent> timeline = new ArrayList<>();

    // ===============================
    // CONSTRUCTOR
    // ===============================
    public Issue() {}

    // ===============================
    // TIMELINE HELPERS
    // ===============================
    public List<TimelineEvent> getTimeline() {
        if (timeline == null) {
            timeline = new ArrayList<>();
        }
        return timeline;
    }

    public void addTimelineEvent(TimelineEvent event) {
        getTimeline().add(event);
    }

    // ===============================
    // GEO LOCATION HELPER
    // ===============================
    public void updateLocation() {
        if (latitude != null && longitude != null) {
            this.location = new GeoJsonPoint(longitude, latitude);
        }
    }

    // ===============================
    // GETTERS & SETTERS
    // ===============================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
 
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
 
    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }
 
    public void setAddress(String address) {
        this.address = address;
    }

    public String getLandmark() {
        return landmark;
    }
 
    public void setLandmark(String landmark) {
        this.landmark = landmark;
    }

    public Double getLatitude() {
        return latitude;
    }
 
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
        updateLocation();
    }

    public Double getLongitude() {
        return longitude;
    }
 
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
        updateLocation();
    }

    public GeoJsonPoint getLocation() {
        return location;
    }

    public String getCreatedBy() {
        return createdBy;
    }
 
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getContact() {
        return contact;
    }
 
    public void setContact(String contact) {
        this.contact = contact;
    }

    public Boolean getAnonymous() {
        return anonymous;
    }
 
    public void setAnonymous(Boolean anonymous) {
        this.anonymous = anonymous;
    }

    public String getStatus() {
        return status;
    }
 
    public void setStatus(String status) {
        this.status = status;
    }

    public String getCategory() {
        return category;
    }
 
    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }
 
    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getAssignedTo() {
        return assignedTo;
    }
 
    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getImageUrl() {
        return imageUrl;
    }
 
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getCreatedAt() {
        return createdAt;
    }
 
    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }
}
