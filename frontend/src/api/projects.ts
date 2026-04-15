import API from "./axios";

export const getProjects = (page: number = 1, search: string = "") =>
  API.get(`/api/projects/?page=${page}&search=${search}`);

export const createProject = (data: any) =>
  API.post("/api/projects/", data);

export const updateProject = (id: number, data: any) =>
  API.put(`/api/projects/${id}/`, data);

export const deleteProject = (id: number) =>
  API.delete(`/api/projects/${id}/`);