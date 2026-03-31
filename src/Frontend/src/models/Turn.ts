import type { AgentRole } from "./AgentRole.ts";
import type { TurnStatus } from "./TurnStatus.ts";

export interface Turn {
  code: string;
  role: AgentRole;
  createdAt: string;
  expiresAt: string | null;
  status: TurnStatus;
}
