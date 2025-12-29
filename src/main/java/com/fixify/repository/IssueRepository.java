package com.fixify.repository;

import com.fixify.model.Issue;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends MongoRepository<Issue, String> {

    List<Issue> findByStatus(String status);

    List<Issue> findByAssignedTo(String assignedTo);
}
