 
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL_LOCAL || import.meta.env.VITE_API_BASE_URL ,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // config.headers["Content-Type"] = "multipart/form-data";
    delete config.headers["Content-Type"];
  }
  return config;
});

export default api;
