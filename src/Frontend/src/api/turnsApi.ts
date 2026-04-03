import { axiosClient } from "./axiosClient.ts";
import type { Turn } from "../models/Turn.ts";
import type { TurnsSummary } from "../models/TurnsSummary.ts";
import axios from "axios";
import type { TurnAssignment } from "../models/TurnAssignment.ts";

export async function newTurn(type: string) {
  try {
    const response = await axiosClient.post<Turn>(`/turns?role=${type}`);
    return response.data;
  } catch (error) {
    throw new Error("Unknown error when requesting a turn", { cause: error });
  }
}

export async function getTurns() {
  try {
    const response = await axiosClient.get<TurnsSummary>("/turns");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) throw new Error("Invalid status");
    throw new Error("Unknown error when getting turns", { cause: error });
  }
}

export async function getAssignations() {
  try {
    const response = await axiosClient.get<TurnAssignment[]>("/turns/assign");
    return response.data;
  } catch (error) {
    throw new Error("Unknown error when getting assignations", { cause: error });
  }
}

export async function assignTurn(agentId: string): Promise<TurnAssignment | null> {
  try {
    const response = await axiosClient.post<TurnAssignment>(`/turns/assign/${agentId}`);
    if (response.status === 204) return null;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) throw new Error("Agent is inactive");
    if (axios.isAxiosError(error) && error.response?.status === 404) throw new Error("Agent not found");
    throw new Error("Unknown error when requesting a turn", { cause: error });
  }
}

