// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL_LOCAL ,
  withCredentials: false,
});

// الحل السحري اللي شغال مع الكل في 2025
api.interceptors.request.use((config) => {
  // لو البيانات FormData → خلّي المتصفح يحدد الـ boundary لوحده
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
    // أو احذف الـ header خالص وخلّي المتصفح يعمله
    // delete config.headers["Content-Type"];
  }
  return config;
});

export default api;