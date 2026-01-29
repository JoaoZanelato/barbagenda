import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import api from "./src/services/api";

// Telas
import { Welcome } from "./src/screens/Welcome";
import { ClientAuth } from "./src/screens/Client/Auth";
import { ClientHome } from "./src/screens/Client/Home"; // (Crie este similar ao BarberHome)
import { BarberAuth } from "./src/screens/Barber/Auth"; // (Crie este similar ao ClientAuth)
import { BarberDashboard } from "./src/screens/Barber/Home";

// Estado global simples de navegação
type Role = "none" | "barber" | "client";
type AuthState = "guest" | "authenticated";

export default function App() {
  const [role, setRole] = useState<Role>("none");
  const [auth, setAuth] = useState<AuthState>("guest");

  // Função para salvar token e navegar
  const handleLoginSuccess = (token: string) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setAuth("authenticated");
  };

  const handleLogout = () => {
    setAuth("guest");
    setRole("none");
    api.defaults.headers.common["Authorization"] = "";
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#18181B" }}>
      <StatusBar style="light" />

      {/* 1. Tela Inicial */}
      {role === "none" && <Welcome onSelectRole={setRole} />}

      {/* 2. Fluxo BARBEIRO */}
      {role === "barber" && auth === "guest" && (
        <BarberAuth
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setRole("none")}
        />
      )}
      {role === "barber" && auth === "authenticated" && (
        <BarberDashboard onLogout={handleLogout} />
      )}

      {/* 3. Fluxo CLIENTE */}
      {role === "client" && auth === "guest" && (
        <ClientAuth
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setRole("none")}
        />
      )}
      {role === "client" && auth === "authenticated" && (
        // Aqui você criaria o src/screens/Client/Home seguindo o mesmo padrão do Dashboard
        <ClientHome onLogout={handleLogout} />
      )}
    </View>
  );
}
