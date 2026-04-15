import API from "./axios";

export const getTasks = (projectId: string, page: number = 1, search: string = "") =>
  API.get(`/api/tasks/?project=${projectId}&page=${page}&search=${search}`);

export const createTask = (data: any) =>
  API.post("/api/tasks/", data);

export const updateTask = (id: number, data: any) =>
  API.put(`/api/tasks/${id}/`, data);

export const deleteTask = (id: number) =>
  API.delete(`/api/tasks/${id}/`);