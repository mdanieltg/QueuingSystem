import type { Turn } from "./Turn.ts";

export interface TurnsSummary {
  totalTurns: number;
  turnsByRole: Turn[];
}
