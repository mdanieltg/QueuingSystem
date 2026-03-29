import type { RunnerRole } from "./RunnerRole.ts";

export interface TurnAssignment {
  turn: string;
  type: RunnerRole;
  station: number;
}
