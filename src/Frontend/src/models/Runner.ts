import type { RunnerRole } from "./RunnerRole.ts";

export interface Runner {
  id: string;
  role: RunnerRole;
  station: string;
  isActive: boolean;
}
