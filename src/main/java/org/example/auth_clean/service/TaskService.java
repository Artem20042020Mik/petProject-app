package org.example.auth_clean.service;


import org.example.auth_clean.dto.TaskDto;
import org.example.auth_clean.exception.ResourceNotFoundException;
import org.example.auth_clean.model.Project;
import org.example.auth_clean.model.Task;
import org.example.auth_clean.model.TaskStatus;
import org.example.auth_clean.model.User;
import org.example.auth_clean.repository.ProjectRepository;
import org.example.auth_clean.repository.TaskRepository;
import org.example.auth_clean.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public TaskService(UserRepository userRepository, ProjectRepository projectRepository, TaskRepository taskRepository){
        this.taskRepository= taskRepository;
        this.projectRepository=projectRepository;
        this.userRepository=userRepository;
    }

    @Transactional
    public TaskDto.Response createTask(TaskDto.Request request, Long ownerId){
        Project project = projectRepository
                .findByIdAndOwnerId(request.projectId(), ownerId)
                .orElseThrow(()->new ResourceNotFoundException("project is not found or you have no rights"));

        User owner = userRepository.getReferenceById(ownerId);

        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setOwner(owner);
        task.setDeadline(request.deadline());
        task.setPriority(request.priority());
        task.setStatus(TaskStatus.TODO);
        task.setProject(project);

        Task saved = taskRepository.save(task);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<TaskDto.Response> getTasksByProject(Long userId, Long projectId){
        if (projectRepository.findByIdAndOwnerId(projectId,userId).isEmpty()){
            throw new ResourceNotFoundException("the project is not found or you have no permission");
        }

        return taskRepository
                .findAllByProjectIdAndOwnerIdOrderByCreatedAtDesc(projectId,userId)
                .stream().map(task->{
                    return mapToResponse(task);
                }).toList();
    }

    @Transactional
    public TaskDto.Response updateTaskStatus(TaskStatus status, Long ownerId, Long taskId){
        Task task = taskRepository.findByIdAndOwnerId(taskId,ownerId)
                .orElseThrow(()->new ResourceNotFoundException("task is not found"));

        task.setStatus(status);
        return mapToResponse(task);
    }


    @Transactional
    public void deleteTask(Long ownerId,Long taskId){
        Task task = taskRepository.findByIdAndOwnerId(taskId,ownerId)
                .orElseThrow(()->new ResourceNotFoundException("task is not found "));
        taskRepository.delete(task);
    }


    private TaskDto.Response mapToResponse(Task task){
        return new TaskDto.Response(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getPriority(),
                task.getStatus(),
                task.getDeadline(),
                task.getProject().getId(),
                task.getCreatedAt()
        );
    }
}
