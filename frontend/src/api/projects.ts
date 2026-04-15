import API from "./axios";

export const getProjects = (page: number = 1, search: string = "") => 
  API.get(`/projects/?page=${page}&search=${search}`);

export const createProject = (data: any) =>
  API.post("/projects/", data);

export const updateProject = (id: number, data: any) =>
  API.put(`/projects/${id}/`, data);

export const deleteProject = (id: number) =>
  API.delete(`/projects/${id}/`);