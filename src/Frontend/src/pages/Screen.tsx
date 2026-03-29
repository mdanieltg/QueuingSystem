import { getAssignations, getTurns } from "../api/turnsApi.ts";
import { useEffect, useState } from "react";
import type { TurnAssignment } from "../models/TurnAssignment.ts";

export default function Screen() {
  const [currentTurn, setCurrentTurn] = useState<TurnAssignment | null>(null);
  const [ejecutivoTurns, setEjecutivoTurns] = useState<TurnAssignment[]>([]);
  const [ventanillaTurns, setVentanillaTurns] = useState<TurnAssignment[]>([]);
  const [queue, setQueue] = useState<number>(0);

  useEffect(() => {
    getTurns()
      .then(turns => {
        setQueue(turns.totalTurns);
      })
      .catch(error => {
        console.error("Error fetching turns:", error);
      });
    getAssignations()
      .then(turns => {
        setEjecutivoTurns(turns.find(t => t.type === "ejecutivo")?.assignations ?? []);
        setVentanillaTurns(turns.find(t => t.type === "cajero")?.assignations ?? []);
      })
      .catch(error => {
        console.error("Error fetching assignations:", error);
      });
  }, [setQueue]);

  return (
    <div>
      <h1>Turnos</h1>
      {currentTurn &&
        <h2>Turno {currentTurn.turn} {currentTurn.type} {currentTurn.station}</h2>
      }
      <div>
        <h2>Ventanilla</h2>
        <ul>
          {ventanillaTurns.map(turn => <li key={turn.turn}>{turn.turn} {turn.type} {turn.station}</li>)}
        </ul>
      </div>
      <div>
        <h2>Ejecutivo</h2>
        <ul>
          {ejecutivoTurns.map(turn => <li key={turn.turn}>{turn.turn} {turn.type} {turn.station}</li>)}
        </ul>
      </div>
      <div>Clientes en espera: {queue}</div>
    </div>
  );
}
