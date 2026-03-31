import type { AgentRole } from "./AgentRole.ts";

export interface Agent {
  id: string;
  role: AgentRole;
  station: string;
  isActive: boolean;
}
