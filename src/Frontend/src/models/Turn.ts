import type { RunnerRole } from "./RunnerRole.ts";
import type { TurnStatus } from "./TurnStatus.ts";

export interface Turn {
  code: string;
  role: RunnerRole;
  createdAt: string;
  expiresAt: string | null;
  status: TurnStatus;
}
