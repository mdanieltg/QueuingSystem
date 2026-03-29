import { useState } from "react";
import { newTurn } from "../api/turnsApi";
import { RunnerRole } from "../models/RunnerRole.ts";

export default function TurnMachine() {
  const [turn, setTurn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function requestTurn(type: RunnerRole) {
    try {
      const turn = await newTurn(type);
      setTurn(turn.code);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <div>
      <h1>Bienvenido</h1>
      <p>Por favor selecciona una opción para ser atendido:</p>
      <div>
        <button onClick={() => requestTurn(RunnerRole.CAJERO)}>Ventanilla</button>
        <button onClick={() => requestTurn(RunnerRole.EJECUTIVO)}>Ejecutivo</button>
      </div>
      {turn &&
        <div>
          <p>Tu turno es: {turn}</p>
          <button onClick={() => setTurn(null)}>Ok</button>
        </div>
      }
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
