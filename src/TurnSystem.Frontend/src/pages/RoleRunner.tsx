import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function RoleRunner() {
  const [role] = useState<string>(localStorage.getItem('role') || '');
  const [station] = useState<string>(localStorage.getItem('station') || '');
  const [active, setActive] = useState<boolean>(false);
  const [turn, setTurn] = useState<string | null>(null);
  const navigate = useNavigate();

  async function requestTurn() {
  }

  async function pauseResumeSession() {
  }

  async function unregister() {
    // Call API to unregister role and station (not implemented yet)

    // Clear local storage
    localStorage.removeItem('role');
    localStorage.removeItem('station');

    // Redirect to home
    navigate('/');
  }

  useEffect(() => {
    // If we don't have a role and station in the local storage upon activation, redirect to /
    if (!localStorage.getItem('role') || !localStorage.getItem('station')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div>
      {turn
        ? <div>Atendiendo a <span>{turn}</span></div>
        : <div>No hay turnos pendientes</div>}
      <button onClick={requestTurn}>Solicitar turno</button>
      {active
        ? <button onClick={pauseResumeSession}>Pausar sesión</button>
        : <button onClick={pauseResumeSession}>Reanudar sesión</button>}
      <button onClick={unregister}>Terminar sesión</button>
    </div>
  );
}
