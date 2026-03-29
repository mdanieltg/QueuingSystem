import type { TurnStatus } from "./TurnStatus.ts";

export interface Turn {
  code: string;
  role: string;
  createdAt: Date;
  expiresAt: Date | null;
  status: TurnStatus;
}
