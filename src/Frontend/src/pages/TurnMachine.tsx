import { useState } from "react";

export default function TurnMachine() {
  const [turn, setTurn] = useState<string | null>(null);

  async function requestTurn(type: "ventanilla" | "ejecutivo") {
    const message = `Solicitando turno para ${type}`;
    console.log(message);
    setTurn(message);
  }

  return (
    <div>
      <h1>Bienvenido</h1>
      <p>Por favor selecciona una opción para ser atendido:</p>
      <div>
        <button onClick={() => requestTurn("ventanilla")}>Ventanilla</button>
        <button onClick={() => requestTurn("ejecutivo")}>Ejecutivo</button>
      </div>
      {turn &&
        <div>
          <p>Tu turno es: {turn}</p>
          <button onClick={() => setTurn(null)}>Ok</button>
        </div>
      }
    </div>
  );
}
