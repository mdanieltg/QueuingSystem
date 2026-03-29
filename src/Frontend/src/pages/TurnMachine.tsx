import { useEffect, useState } from "react";
import { getTurns, newTurn } from "../api/api";

export default function TurnMachine() {
  const [turn, setTurn] = useState<string | null>(null);
  const [queue, setQueue] = useState<number>(0);

  async function requestTurn(type: "ventanilla" | "ejecutivo") {
    try {
      const turn = await newTurn(type);
      const turnsSummary = await getTurns();
      setTurn(turn.code);
      setQueue(turnsSummary.totalTurns);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getTurns()
      .then((turnsSummary) => {
        setQueue(turnsSummary.totalTurns);
      });
  }, [setQueue]);

  return (
    <div>
      <h1>Bienvenido</h1>
      <p>Por favor selecciona una opción para ser atendido:</p>
      <div>
        <button onClick={() => requestTurn("ventanilla")}>Ventanilla</button>
        <button onClick={() => requestTurn("ejecutivo")}>Ejecutivo</button>
      </div>
      {turn &&
        <div>
          <p>Tu turno es: {turn}</p>
          <button onClick={() => setTurn(null)}>Ok</button>
        </div>
      }
      <div>{queue} clientes en espera</div>
    </div>
  );
}
