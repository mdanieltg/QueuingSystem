import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRunner, toggleRunner, unenroll } from "../api/runnersApi.ts";
import { assignTurn } from "../api/turnsApi.ts";

export default function RoleRunner() {
  const [id, setId] = useState<string>(localStorage.getItem("id") || "");
  const [role, setRole] = useState<string>(localStorage.getItem("role") || "");
  const [station, setStation] = useState<string>(localStorage.getItem("station") || "");
  const [active, setActive] = useState<boolean>(false);
  const [turn, setTurn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function requestTurn() {
    if (!id) return;
    setError(null);

    try {
      const assignment = await assignTurn(id);
      setTurn(assignment?.turn ?? null);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      setError("Unknown error");
    }
  }

  async function pauseResumeSession() {
    if (!id) return;
    setError(null);

    try {
      setActive(await toggleRunner(id));
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      setError("Unknown error");
    }
  }

  async function unregister() {
    if (!id) return;
    setError(null);

    try {
      // Call API to unregister role and station
      await unenroll(id);

      // Clear local storage
      localStorage.clear();

      // Redirect to home
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message.includes("Runner not found")) {
        // Clear local storage
        localStorage.clear();

        // Redirect to home
        navigate("/");

        return;
      }
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      setError("Unknown error");
    }
  }

  useEffect(() => {
    // If we don't have an id, role, and station in the local storage upon activation, redirect to /
    if (!localStorage.getItem("id")) {
      navigate("/");
    }

    // Fetch Runner information
    getRunner(id)
      .then(runner => {
        setId(runner.id);
        setRole(runner.role);
        setStation(runner.station);
        setActive(runner.isActive);
      })
      .catch(err => {
        console.error(err);
        localStorage.clear();
        navigate("/");
      });
  }, [id, navigate]);

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
