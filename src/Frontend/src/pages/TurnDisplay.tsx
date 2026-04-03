import { getAssignations, getTurns } from "../api/turnsApi.ts";
import { useEffect, useState } from "react";
import type { TurnAssignment } from "../models/TurnAssignment.ts";
import { AgentRole } from "../models/AgentRole.ts";
import * as signalR from "@microsoft/signalr";

export default function TurnDisplay() {
  const [latestTurn, setLatestTurn] = useState<TurnAssignment | null>(null);
  const [recentTurns, setRecentTurns] = useState<TurnAssignment[]>([]);
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
      const allAssignations = await getAssignations();
      setRecentTurns(allAssignations);
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
      if (type === AgentRole.EXECUTIVE || type === AgentRole.WINDOW)
        setLatestTurn({ turn: turn, type: type, station: station });
      else {
        console.error("Invalid role:", type);
        setLatestTurn(null);
      }
      await fetchTurns();
      await fetchQueue();
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
      {latestTurn &&
        <div className="alert alert-primary text-center">
          Turn: {latestTurn.turn} at {latestTurn.type} {latestTurn.station}
        </div>
      }
      <div>
        <h2>Previous turns</h2>
        <ul className="list-group">
          {recentTurns.map(turn =>
            <li key={turn.turn} className="list-group-item d-flex justify-content-between align-items-center" >
              {turn.turn}
              <span className="badge text-bg-primary rounded-pill">{turn.type} {turn.station}</span>
            </li>)}
        </ul>
      </div>
      <div className="mt-3">Customers waiting: {queue}</div>
    </div>
  );
}
