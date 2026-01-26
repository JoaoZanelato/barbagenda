import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Dashboard } from './pages/Dashbord/Dashboard'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />


      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
