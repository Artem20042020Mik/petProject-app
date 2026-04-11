package org.example.auth_clean.controller;


import jakarta.validation.Valid;
import org.example.auth_clean.dto.ProjectDto;
import org.example.auth_clean.model.Project;
import org.example.auth_clean.security.JwtAuthenticationFilter;
import org.example.auth_clean.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService){
        this.projectService= projectService;
    }

    @PostMapping("/create")
    public ResponseEntity<ProjectDto.Response> createProject(@Valid @RequestBody ProjectDto.Request request,
                                                             @AuthenticationPrincipal JwtAuthenticationFilter.JwtAuthUser jwtAuthUser){
        return ResponseEntity.ok(projectService.createProject(request, jwtAuthUser.userId()));
    }

    @GetMapping
    public ResponseEntity<List<ProjectDto.Response>> getAllProjects(@AuthenticationPrincipal JwtAuthenticationFilter.JwtAuthUser jwtAuthUser){
        return ResponseEntity.ok(projectService.getUserProjects(jwtAuthUser.userId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id
            , @AuthenticationPrincipal JwtAuthenticationFilter.JwtAuthUser jwtAuthUser){
        projectService.deleteProject(id, jwtAuthUser.userId());
        return ResponseEntity.noContent().build();
    }
}
