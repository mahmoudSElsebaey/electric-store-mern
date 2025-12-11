// src/services/authApi.ts
import api from "./api";

// نوع البيانات للتسجيل
export type RegisterData = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  birthdate?: string;
};

// نوع البيانات لتسجيل الدخول
export type LoginData = {
  email: string;
  password: string;
};

// نوع الرد من الـ backend
export type AuthResponse = {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    birthdate?: string;
    additionalInfo?: { [key: string]: string };
    isAdmin: boolean;
  };
};

// تسجيل حساب جديد
export const register = (data: RegisterData): Promise<AuthResponse> =>
  api.post("/auth/register", data);

// تسجيل الدخول
export const login = (data: LoginData): Promise<AuthResponse> =>
  api.post("/auth/login", data);

// جلب بيانات المستخدم الحالي (اختياري - لو عايز تستخدمه في checkAuth)
export const getMe = (): Promise<{ user: AuthResponse["user"] }> =>
  api.get("/auth/me");