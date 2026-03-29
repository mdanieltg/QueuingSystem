import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import RoleRunner from "./pages/RoleRunner";
import TurnMachine from "./pages/TurnMachine";
import Screen from "./pages/Screen";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/screen" element={<Screen />} />
        <Route path="/turns" element={<TurnMachine />} />
        <Route path="/role" element={<RoleRunner />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
