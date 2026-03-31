import { axiosClient } from "./axiosClient.ts";
import type { Agent } from "../models/Agent.ts";
import axios from "axios";

export async function getAgent(agentId: string) {
  try {
    const response = await axiosClient.get<Agent>(`/agents/${agentId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) throw new Error("Agent not found");
    throw new Error("Unknown error when getting agent", { cause: error });
  }
}

export async function enroll(role: string, station: string) {
  try {
    const response = await axiosClient.post<Agent>("/agents", { role, station });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) throw new Error("Agent already registered");
    throw new Error("Unknown error when enrolling", { cause: error });
  }
}

export async function unenroll(agentId: string) {
  try {
    await axiosClient.delete(`/agents/${agentId}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) throw new Error("Agent not found");
    throw new Error("Unknown error when unenrolling", { cause: error });
  }
}

export async function toggleAgent(agentId: string) {
  try {
    const response = await axiosClient.post<boolean>(`/agents/${agentId}/toggleStatus`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) throw new Error("Agent not found");
    throw new Error("Unknown error when toggling agent", { cause: error });
  }
}
