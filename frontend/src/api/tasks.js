import api from "./axios.js";

export const createTask=  (title, description, projectId, priority, deadline) =>
    api.post("/api/tasks", {title, description, deadline, priority, projectId})

export const getTasksByProject = (project) =>
    api.get(`/api/tasks/project/${project}`);

export const updateTaskStatus = (taskId,taskStatus) =>
    api.patch(`/api/tasks/${taskId}/status`, {status: taskStatus});

export const deleteTask = (taskId) =>
    api.delete(`/api/tasks/${taskId}`);