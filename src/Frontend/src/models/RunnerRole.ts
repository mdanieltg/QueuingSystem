export const RunnerRole = {
  CAJERO: "cajero",
  EJECUTIVO: "ejecutivo",
} as const;

export type RunnerRole = (typeof RunnerRole)[keyof typeof RunnerRole];
