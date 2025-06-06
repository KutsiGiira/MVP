package com.example.Back.Repository;

import com.example.Back.Model.Entity.Parent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParentRepo extends JpaRepository<Parent, Long> {
    Optional<Parent> findByUsername(String username);
}
