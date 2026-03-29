import { useState } from "react";
import { newTurn } from "../api/turnsApi";

export default function TurnMachine() {
  const [turn, setTurn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function requestTurn(type: "cajero" | "ejecutivo") {
    try {
      const turn = await newTurn(type);
      setTurn(turn.code);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      setError("Unknown error");
    }
  }

  return (
    <div>
      <h1>Bienvenido</h1>
      <p>Por favor selecciona una opción para ser atendido:</p>
      <div>
        <button onClick={() => requestTurn("cajero")}>Ventanilla</button>
        <button onClick={() => requestTurn("ejecutivo")}>Ejecutivo</button>
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
