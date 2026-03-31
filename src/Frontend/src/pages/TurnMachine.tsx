import { useState } from "react";
import { newTurn } from "../api/turnsApi";
import { AgentRole } from "../models/AgentRole.ts";

export default function TurnMachine() {
  const [turn, setTurn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function requestTurn(type: AgentRole) {
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
    <div className="text-center">
      <h1>Welcome</h1>
      <p>Please select an option to be served:</p>
      <div className="btn-group" role="group">
        <button onClick={() => requestTurn(AgentRole.WINDOW)}
                className="btn btn-outline-primary">Window
        </button>
        <button onClick={() => requestTurn(AgentRole.EXECUTIVE)}
                className="btn btn-outline-primary">Executive
        </button>
      </div>
      {turn &&
        <div onClick={() => setTurn(null)}
             className="mt-3 alert alert-secondary">
          Turn: {turn}
        </div>
      }
      {error && <div className="mt-3 alert alert-danger">{error}</div>}
    </div>
  );
}
