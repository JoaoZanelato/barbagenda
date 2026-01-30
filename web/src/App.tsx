import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Dashboard } from "./pages/Dashbord/Dashboard";
import { SaaSAdmin } from "./pages/Admin/SaaSAdmin";

// Use "export function" (sem default)
export function App() {
  return (
    <Routes>
      {/* Rota Pública (Login) */}
      <Route path="/" element={<Login />} />

      {/* Rota Privada (Dashboard da Barbearia) */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Rota do Super Admin*/}
      <Route path="/saas" element={<SaaSAdmin />} />

      {/* Qualquer outra rota volta para o Login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
