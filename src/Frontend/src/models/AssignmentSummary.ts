import type { TurnAssignment } from "./TurnAssignment.ts";
import type { AgentRole } from "./AgentRole.ts";

export interface AssignmentSummary {
  type: AgentRole;
  assignations: TurnAssignment[];
}
