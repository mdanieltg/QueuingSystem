import { getAssignations, getTurns } from "../api/turnsApi.ts";
import { useEffect, useState } from "react";
import type { TurnAssignment } from "../models/TurnAssignment.ts";
import { AgentRole } from "../models/AgentRole.ts";

export default function TurnDisplay() {
  const [currentTurn] = useState<TurnAssignment | null>(null);
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
        setEjecutivoTurns(turns.find(t => t.type === AgentRole.EXECUTIVE)?.assignations ?? []);
        setVentanillaTurns(turns.find(t => t.type === AgentRole.WINDOW)?.assignations ?? []);
      } catch (error) {
        console.error("Error fetching assignations:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>Recent turns</h1>
      {currentTurn &&
        <div className="alert alert-primary">Turn: {currentTurn.turn} at {currentTurn.type} {currentTurn.station}</div>
      }
      <div className="row">
        <div className="col">
          <h2>Window</h2>
          <ul>
            {ventanillaTurns.map(turn => <li key={turn.turn}>{turn.turn} {turn.type} {turn.station}</li>)}
          </ul>
        </div>
        <div className="col">
          <h2>Executive</h2>
          <ul>
            {ejecutivoTurns.map(turn => <li key={turn.turn}>{turn.turn} {turn.type} {turn.station}</li>)}
          </ul>
        </div>
        <div>Customers waiting: {queue}</div>
      </div>
    </div>
  );
}
