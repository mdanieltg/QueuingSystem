export const TurnStatus = {
  CREATED: 0,
  ASSIGNED: 1,
  COMPLETED: 2,
} as const;

export type TurnStatus = (typeof TurnStatus)[keyof typeof TurnStatus];
