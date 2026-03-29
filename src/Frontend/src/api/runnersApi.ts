import { axiosClient } from "./axiosClient.ts";
import type { Runner } from "../models/Runner.ts";
import axios from "axios";

export async function getRunner(runnerId: string) {
  try {
    const response = await axiosClient.get<Runner>(`/runners/${runnerId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) throw new Error("Runner not found");
    throw new Error("Unknown error when getting runner", { cause: error });
  }
}

export async function enroll(role: string, station: string) {
  try {
    const response = await axiosClient.post<Runner>("/runners", { role, station });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) throw new Error("Runner already registered");
    throw new Error("Unknown error when enrolling", { cause: error });
  }
}

export async function unenroll(runnerId: string) {
  try {
    await axiosClient.delete(`/runners/${runnerId}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) throw new Error("Runner not found");
    throw new Error("Unknown error when unenrolling", { cause: error });
  }
}

export async function toggleRunner(runnerId: string) {
  try {
    const response = await axiosClient.post<boolean>(`/runners/${runnerId}/toggleStatus`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) throw new Error("Runner not found");
    throw new Error("Unknown error when toggling runner", { cause: error });
  }
}
