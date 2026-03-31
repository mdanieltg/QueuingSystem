export const AgentRole = {
  WINDOW: "Window",
  EXECUTIVE: "Executive"
} as const;

export type AgentRole = (typeof AgentRole)[keyof typeof AgentRole];
