import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import TurnMachine from './pages/TurnMachine';
import RoleRunner from './pages/RoleRunner';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/turns" element={<TurnMachine />} />
        <Route path="/role" element={<RoleRunner />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
