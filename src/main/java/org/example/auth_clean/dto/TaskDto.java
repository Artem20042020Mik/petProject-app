package org.example.auth_clean.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.example.auth_clean.model.Priority;
import org.example.auth_clean.model.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskDto {

    public record Request(
            @NotBlank(message = "the title of the task can't be blank")
            String title,
            String description,
            @NotNull
            Priority priority,
            LocalDate deadline,
            @NotNull(message = "project ID is necessary")
            Long projectId
    ){}

    public record StatusUpdateRequest(
            @NotNull
            TaskStatus status
    ){}

    public record Response(
            Long id,
            String title,
            String description,
            Priority priority,
            TaskStatus status,
            LocalDate deadline,
            Long projectId,
            LocalDateTime createdAt
    ){}
}
