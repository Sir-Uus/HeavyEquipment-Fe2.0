import axios from "axios";
import { Equipments } from "../types/EquipmentTypes";

export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const CHAT_URL = import.meta.env.VITE_CHAT_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.replace("/login?sessionExpired=true");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

export const getEquipmentIds = async () => {
  return (await axiosInstance.get<Equipments[]>("Equipments")).data.map((equipment) => equipment.id);
};
