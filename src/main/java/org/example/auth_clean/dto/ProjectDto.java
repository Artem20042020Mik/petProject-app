package org.example.auth_clean.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class ProjectDto {
    public record Response(Long id,
                           String name,
                           String description,
                           LocalDateTime createdAt){
    }

    public record Request(@NotBlank(message="the name of the project can't be blank")
                            String name,
                            String description){}
}
