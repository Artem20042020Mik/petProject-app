import api from "./axios.js";

export const register = (email, password) =>
    api.post("/auth/register", {email,password});

export const login = (email, password) =>
    api.post("auth/login", {email, password});

export const logout = () =>
    api.post("auth/logout");