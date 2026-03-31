import axios from "axios";

const API_URL: string = import.meta.env.VITE_API_URL;
const API_KEY: string = import.meta.env.VITE_API_KEY;

export const axiosClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "X-Api-Key": API_KEY
  }
});
