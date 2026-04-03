import { getAssignations, getTurns } from "../api/turnsApi.ts";
import { useEffect, useState } from "react";
import type { TurnAssignment } from "../models/TurnAssignment.ts";
import { AgentRole } from "../models/AgentRole.ts";
import * as signalR from "@microsoft/signalr";

export default function TurnDisplay() {
  const [currentTurn, setCurrentTurn] = useState<TurnAssignment | null>(null);
  const [ejecutivoTurns, setEjecutivoTurns] = useState<TurnAssignment[]>([]);
  const [ventanillaTurns, setVentanillaTurns] = useState<TurnAssignment[]>([]);
  const [queue, setQueue] = useState<number>(0);
  const TURN_ASSIGNED = "turnAssigned";
  const TURN_CREATED = "turnCreated";

  async function fetchQueue() {
    try {
      const turns = await getTurns();
      setQueue(turns.totalTurns);
    } catch (error) {
      console.error("Error fetching turns:", error);
    }
  }

  async function fetchTurns() {
    try {
      const turns = await getAssignations();
      setEjecutivoTurns(turns.find(t => t.type === AgentRole.EXECUTIVE)?.assignations ?? []);
      setVentanillaTurns(turns.find(t => t.type === AgentRole.WINDOW)?.assignations ?? []);
    } catch (error) {
      console.error("Error fetching assignations:", error);
    }
  }

  useEffect(() => {
    console.log("useEffect");
    const API_URL: string = import.meta.env.VITE_API_URL;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/ws/turns`)
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.on(TURN_CREATED, async () => {
      await fetchQueue();
    });

    connection.on(TURN_ASSIGNED, async (turn: string, type: string, station: string) => {
      if (type === AgentRole.EXECUTIVE)
        setCurrentTurn({ turn: turn, type: type, station: station });
      else if (type === AgentRole.WINDOW)
        setCurrentTurn({ turn: turn, type: type, station: station });
      else {
        setCurrentTurn(null);
      }
      await fetchTurns();
    });

    connection.start()
      .then(() => {
      })
      .catch(err => {
        console.error("Error during start", err);
      });

    fetchQueue().then(() => {
    });
    fetchTurns().then(() => {
    });

    return () => {
      connection.off(TURN_CREATED);
      connection.off(TURN_ASSIGNED);
      connection.stop().catch(() => {
      });
    };
  }, []);

  return (
    <div className="container">
      <h1>Recent turns</h1>
      {currentTurn &&
        <div className="alert alert-primary text-center">
          Turn: {currentTurn.turn} at {currentTurn.type} {currentTurn.station}
        </div>
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
