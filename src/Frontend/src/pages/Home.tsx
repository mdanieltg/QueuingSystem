import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enroll } from "../api/runnersApi.ts";

export default function Home() {
  const [role, setRole] = useState("");
  const [station, setStation] = useState("");
  const [roleError, setRoleError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleMachineTurn() {
    navigate("/turns");
  }

  async function handleEnroll(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validate role and station
    if (!role) {
      setRoleError("Por favor selecciona un rol");
      return;
    }

    if (!station) {
      setRoleError("Por favor ingresa un número de estación válido");
      return;
    }

    try {
      // Call API to enroll role and station
      const runner = await enroll(role, station);

      // Save id, role, and station in local storage
      localStorage.setItem("id", runner.id);

      // Redirect to role runner
      navigate("/role");
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setRoleError(err.message);
        return;
      }
      setRoleError("Error al intentar enrolar");
    }
  }

  useEffect(() => {
    // If we already have a role and station in the local storage upon activation, redirect to /role
    if (localStorage.getItem("id")) {
      // Re-register the role and station with the API
      enroll(role, station)
        .then(() => {
          navigate("/role");
        })
        .catch((err) => {
          console.error(err);
          if (err instanceof Error) {
            setRoleError(err.message);
            return;
          }
          setRoleError("Error al intentar enrollar");
        });
    }
  }, [role, station, navigate]);

  return (
    <div>
      <h1>Sistema de turnos</h1>
      <p>Elige el rol de este equipo</p>
      <div>
        <div>
          <button onClick={handleMachineTurn}>Máquina de turnos</button>
        </div>
        <div>
          <form onSubmit={handleEnroll}>
            <label htmlFor="role">Rol:</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)} id="role">
              <option value="">Selecciona un rol</option>
              <option value="cajero">Cajero</option>
              <option value="ejecutivo">Ejecutivo</option>
            </select>
            <label htmlFor="station">Estación</label>
            <input value={station}
                   onChange={e => setStation(e.target.value)}
                   type="text" id="station" placeholder="Número de estación" />
            <input type="submit" value="Enrolar" />
          </form>
          {roleError && <p style={{ color: "red" }}>{roleError}</p>}
        </div>
      </div>
    </div>
  );
}
