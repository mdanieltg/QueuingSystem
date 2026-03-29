import axios from "axios";

const API_URL: string = import.meta.env.VITE_API_URL;

export const axiosClient = axios.create({
  baseURL: `${API_URL}/api/v1`
});
