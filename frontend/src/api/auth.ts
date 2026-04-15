import API from "./axios";


export const loginUser = (data: { email: string; password: string }) =>
  API.post("/api/login/", data);

export const registerUser = (data: { email: string; password: string }) =>
  API.post("/api/register/", data);