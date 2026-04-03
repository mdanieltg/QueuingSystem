import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAgent, toggleAgent, unenroll } from "../api/agentsApi.ts";
import { assignTurn } from "../api/turnsApi.ts";
import type { AgentRole } from "../models/AgentRole.ts";

export default function AgentDashboard() {
  const [id, setId] = useState<string>(localStorage.getItem("id") || "");
  const [role, setRole] = useState<AgentRole | "">(localStorage.getItem("role") as AgentRole || "");
  const [station, setStation] = useState<string>(localStorage.getItem("station") || "");
  const [active, setActive] = useState<boolean>(false);
  const [turn, setTurn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.clear();
    navigate("/");
  }, [navigate]);

  async function requestTurn() {
    if (!id) return;
    setError(null);

    try {
      const assignment = await assignTurn(id);
      if (assignment !== null)
        setTurn(assignment.turn);
      else {
        setTurn(null);
        setError("No turns available");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function pauseResumeSession() {
    if (!id) return;
    setError(null);

    try {
      setActive(await toggleAgent(id));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function unregister() {
    if (!id) return;
    setError(null);

    try {
      await unenroll(id);
      logout();
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message.includes("Agent not found")) {
        logout();
        return;
      }
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    async function fetchAgent() {
      try {
        const agent = await getAgent(id);
        setId(agent.id);
        setRole(agent.role);
        setStation(agent.station);
        setActive(agent.isActive);
      } catch (err) {
        console.error(err);
        logout();
      }
    }

    fetchAgent();
  }, [id, navigate, logout]);

  return (
    <div>
      <h2>{role} {station} {active
        ? <span className="badge text-bg-success">Active</span>
        : <span className="badge text-bg-secondary">Inactive</span>}
      </h2>

      {turn
        ? <p>Attending <span className="fw-bold">{turn}</span></p>
        : <p>Waiting...</p>}
      <div className="btn-group" role="group">
        <button onClick={requestTurn} className="btn btn-outline-primary">Request turn</button>
        <button onClick={pauseResumeSession} className={active ? "btn btn-outline-warning" : "btn btn-outline-success"}>
          {active ? "Pause" : "Resume"} service
        </button>
        <button onClick={unregister} className="btn btn-outline-danger">End session</button>
      </div>
      {error && <div className="mt-3 alert alert-danger">{error}</div>}
    </div>
  );
}
