import type { AgentRole } from "./AgentRole.ts";

export interface TurnAssignment {
  turn: string;
  type: AgentRole;
  station: number;
}
