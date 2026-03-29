import type { TurnAssignment } from "./TurnAssignment.ts";

export interface AssignmentSummary {
  type: string;
  assignations: TurnAssignment[];
}
