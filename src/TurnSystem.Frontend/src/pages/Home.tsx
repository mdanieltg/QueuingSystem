import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    if (!station || parseInt(station) <= 0) {
      setRoleError("Por favor ingresa un número de estación válido");
      return;
    }

    // Call API to enroll role and station (not implemented yet)

    // Save role and station in local storage
    localStorage.setItem("role", role);
    localStorage.setItem("station", station);

    // Redirect to role runner
    navigate("/role");
  }

  useEffect(() => {
    // If we already have a role and station in the local storage upon activation, redirect to /role
    if (localStorage.getItem("role") && localStorage.getItem("station")) {
      // Re-register the role and station with the API (not implemented yet)
      navigate("/role");
    }
  }, [navigate]);

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
                   type="number" id="station" placeholder="Número de estación" />
            <input type="submit" value="Enrolar" />
          </form>
          {roleError && <p style={{ color: "red" }}>{roleError}</p>}
        </div>
      </div>
    </div>
  );
}
