import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getRunner, toggleRunner, unenroll } from "../api/runnersApi.ts";
import { assignTurn } from "../api/turnsApi.ts";
import type { RunnerRole } from "../models/RunnerRole.ts";

export default function RoleRunner() {
  const [id, setId] = useState<string>(localStorage.getItem("id") || "");
  const [role, setRole] = useState<RunnerRole | "">(localStorage.getItem("role") as RunnerRole || "");
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
      setTurn(assignment.turn);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function pauseResumeSession() {
    if (!id) return;
    setError(null);

    try {
      setActive(await toggleRunner(id));
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
      if (err instanceof Error && err.message.includes("Runner not found")) {
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

    async function fetchRunner() {
      try {
        const runner = await getRunner(id);
        setId(runner.id);
        setRole(runner.role);
        setStation(runner.station);
        setActive(runner.isActive);
      } catch (err) {
        console.error(err);
        logout();
      }
    }

    fetchRunner();
  }, [id, navigate, logout]);

  return (
    <div>
      <div>{role} {station}</div>
      {turn
        ? <div>Atendiendo a <span>{turn}</span></div>
        : <div>En espera...</div>}
      <button onClick={requestTurn}>Solicitar turno</button>
      <div>
        <span>Estatus: {active ? "Activo" : "Inactivo"}</span>
        <button onClick={pauseResumeSession}>{active ? "Pausar" : "Reanudar"} sesión</button>
      </div>
      <button onClick={unregister}>Terminar sesión</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
