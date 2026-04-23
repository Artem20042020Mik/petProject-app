import api from "./axios.js";

export const createProject = (name, description) =>
    api.post("/api/projects/create", {name, description});

export const getProjects =()=>
    api.get("/api/projects");

export const deleteProject = (id) =>
    api.delete(`/api/projects/${id}`)