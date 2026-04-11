package org.example.auth_clean.service;


import org.example.auth_clean.exception.ResourceNotFoundException;
import org.example.auth_clean.model.User;
import org.springframework.transaction.annotation.Transactional;
import org.example.auth_clean.dto.ProjectDto;
import org.example.auth_clean.model.Project;
import org.example.auth_clean.repository.ProjectRepository;
import org.example.auth_clean.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository){
        this.projectRepository=projectRepository;
        this.userRepository=userRepository;
    }

    @Transactional
    public ProjectDto.Response createProject(ProjectDto.Request request, Long userId){
        User owner = userRepository.getReferenceById(userId);

        Project project = new Project(request.name(), request.description(), owner);
        Project saved = projectRepository.save(project);

        return mapToResponse(saved);
    }


    @Transactional(readOnly = true)
    public List<ProjectDto.Response> getUserProjects(Long userId){
        return projectRepository
                .findAllByOwnerIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(project-> mapToResponse(project))
                .toList();
    }

    @Transactional
    public void deleteProject(Long projectId, Long userId){
        Project project = projectRepository.findByIdAndOwnerId(projectId, userId)
                .orElseThrow(
                        ()-> new ResourceNotFoundException(
                                "Project with project id: "
                                        +projectId.toString()
                                        +" is not found, or you have no rights"));
        projectRepository.delete(project);
    }

    private ProjectDto.Response mapToResponse(Project project){
        return new ProjectDto.Response(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getCreatedAt()
        );
    }
}
