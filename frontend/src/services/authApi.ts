/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";

export const register = (data: any) => api.post("/auth/register", data);
export const login = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);
