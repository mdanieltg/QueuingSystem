import type { TurnAssignment } from "./TurnAssignment.ts";
import type { RunnerRole } from "./RunnerRole.ts";

export interface AssignmentSummary {
  type: RunnerRole;
  assignations: TurnAssignment[];
}
