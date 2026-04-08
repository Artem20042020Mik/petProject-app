package org.example.auth_clean.repository;

import org.example.auth_clean.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByOwnerId(Long ownerId);

    List<Task> findAllByProjectIdAndOwnerIdOrderByCreatedAtDesc(Long projectId, Long ownerId);

    Optional<Task> findByIdAndOwnerId(Long id, Long ownerId);
}
