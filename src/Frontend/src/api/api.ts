import { axiosClient } from "./axiosClient.ts";
import type { Turn } from "../models/Turn.ts";
import type { TurnsSummary } from "../models/TurnsSummary.ts";

export async function newTurn(type: string) {
  const response = await axiosClient.post<Turn>(`/turns?role=${type}`);
  return response.data;
}

export async function getTurns() {
  const response = await axiosClient.get<TurnsSummary>("/turns");
  return response.data;
}
