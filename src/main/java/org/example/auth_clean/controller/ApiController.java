package org.example.auth_clean.controller;

import org.example.auth_clean.exception.ResourceNotFoundException;
import org.example.auth_clean.model.User;
import org.example.auth_clean.repository.ProjectRepository;
import org.example.auth_clean.repository.TaskRepository;
import org.example.auth_clean.repository.UserRepository;
import org.example.auth_clean.security.JwtAuthenticationFilter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public ApiController(ProjectRepository projectRepository, TaskRepository taskRepository, UserRepository userRepository){
        this.projectRepository=projectRepository;
        this.taskRepository=taskRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(Authentication authentication){
        if (authentication == null || !authentication.isAuthenticated()){
            return ResponseEntity.status(401).body(Map.of("error", "unauthenticated"));
        }
        JwtAuthenticationFilter.JwtAuthUser user = (JwtAuthenticationFilter.JwtAuthUser) authentication.getPrincipal();
        User dbUser = userRepository.findById(user.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(Map.of(
                "userId", user.userId(),
                "name", authentication.getName(),
                "email", dbUser.getEmail(),
                "role", authentication.getAuthorities()));
    }

    @GetMapping("/boss-panel")
    public ResponseEntity<?> bossPanel(Authentication authentication){
        if (authentication == null || !authentication.isAuthenticated()){
            return ResponseEntity.status(401).body(Map.of("error", "unauthenticated"));
        }


        boolean isBoss = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_BOSS"));

        if (!isBoss){
            return ResponseEntity.status(403).body(Map.of("error", "not permitted"));
        }
        long amountOfProjects = projectRepository.count();
        long amountOfTasks = taskRepository.count();
        return ResponseEntity.ok(Map.of("message","welcome to control panel, Boss",
                                        "amountOfTasks",amountOfTasks,
                                        "amountOfProjects", amountOfProjects));
    }
}
