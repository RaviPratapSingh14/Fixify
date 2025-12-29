// src/main/java/com/fixify/repository/UserRepository.java
package com.fixify.repository;

import com.fixify.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

    User findByUsername(String username);
    User findByEmail(String email);

    boolean existsByUsername(String username);
    void deleteByUsername(String username);
}
