package org.example.auth_clean.controller;


import jakarta.validation.Valid;
import org.example.auth_clean.dto.TaskDto;
import org.example.auth_clean.security.JwtAuthenticationFilter;
import org.example.auth_clean.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService){
        this.taskService=taskService;
    }

    @PostMapping
    public ResponseEntity<TaskDto.Response> createTask(@Valid @RequestBody TaskDto.Request request
            , @AuthenticationPrincipal JwtAuthenticationFilter.JwtAuthUser jwtAuthUser){
        return ResponseEntity.ok(taskService.createTask(request, jwtAuthUser.userId()));
    }

    @GetMapping("/project/{project}")
    public ResponseEntity<List<TaskDto.Response>> getAllTasksByProject(@PathVariable Long project
            , @AuthenticationPrincipal JwtAuthenticationFilter.JwtAuthUser jwtAuthUser ){
        return ResponseEntity.ok(taskService.getTasksByProject(jwtAuthUser.userId(), project));
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskDto.Response> updateTaskStatus(
            @Valid @RequestBody TaskDto.StatusUpdateRequest request
            ,@PathVariable Long taskId
            ,@AuthenticationPrincipal JwtAuthenticationFilter.JwtAuthUser jwtAuthUser){
        return ResponseEntity.ok(taskService.updateTaskStatus(request.status(), jwtAuthUser.userId(), taskId));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId
            , @AuthenticationPrincipal JwtAuthenticationFilter.JwtAuthUser jwtAuthUser){
        taskService.deleteTask(jwtAuthUser.userId(), taskId);
        return ResponseEntity.noContent().build();
    }
}
