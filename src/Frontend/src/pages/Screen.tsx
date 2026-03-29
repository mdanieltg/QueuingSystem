import { getAssignations, getTurns } from "../api/turnsApi.ts";
import { useEffect, useState } from "react";
import type { TurnAssignment } from "../models/TurnAssignment.ts";
import { RunnerRole } from "../models/RunnerRole.ts";

export default function Screen() {
  const [ejecutivoTurns, setEjecutivoTurns] = useState<TurnAssignment[]>([]);
  const [ventanillaTurns, setVentanillaTurns] = useState<TurnAssignment[]>([]);
  const [queue, setQueue] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const turns = await getTurns();
        setQueue(turns.totalTurns);
      } catch (error) {
        console.error("Error fetching turns:", error);
      }

      try {
        const turns = await getAssignations();
        setEjecutivoTurns(turns.find(t => t.type === RunnerRole.EJECUTIVO)?.assignations ?? []);
        setVentanillaTurns(turns.find(t => t.type === RunnerRole.CAJERO)?.assignations ?? []);
      } catch (error) {
        console.error("Error fetching assignations:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Turnos</h1>
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
