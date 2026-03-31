import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AgentDashboard from "./pages/AgentDashboard.tsx";
import TurnMachine from "./pages/TurnMachine";
import TurnDisplay from "./pages/TurnDisplay.tsx";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/display" element={<TurnDisplay />} />
        <Route path="/turns" element={<TurnMachine />} />
        <Route path="/role" element={<AgentDashboard />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
