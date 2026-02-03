import React, { useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import api from "./src/services/API";

// Fontes
import {
  useFonts,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import {
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

// Telas
import { Welcome } from "./src/screens/Welcome";
import { ClientAuth } from "./src/screens/Client/Auth";
import { ClientHome } from "./src/screens/Client/Home";
import { MyAppointments } from "./src/screens/Client/MyAppointments"; // 👈 Importe a nova tela
import { BarberAuth } from "./src/screens/Barber/Auth";
import { BarberDashboard } from "./src/screens/Barber/Home";
import { colors } from "./src/theme/colors";

SplashScreen.preventAutoHideAsync();

type Role = "none" | "barber" | "client";
type AuthState = "guest" | "authenticated";
type ClientScreenState = "home" | "appointments"; // 👈 Novo Tipo

export default function App() {
  const [role, setRole] = useState<Role>("none");
  const [auth, setAuth] = useState<AuthState>("guest");

  // 👇 Estado para controlar a navegação do cliente
  const [clientView, setClientView] = useState<ClientScreenState>("home");

  let [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handleLoginSuccess = (token: string) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setAuth("authenticated");
  };

  const handleLogout = () => {
    setAuth("guest");
    setRole("none");
    setClientView("home"); // Reseta a tela do cliente
    api.defaults.headers.common["Authorization"] = "";
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background }}
      onLayout={onLayoutRootView}
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />

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

      {/* 👇 A MÁGICA ACONTECE AQUI: Trocamos a tela baseado no estado clientView */}
      {role === "client" &&
        auth === "authenticated" &&
        clientView === "home" && (
          <ClientHome
            onLogout={handleLogout}
            onGoToAppointments={() => setClientView("appointments")} // Passa a função de navegar
          />
        )}

      {role === "client" &&
        auth === "authenticated" &&
        clientView === "appointments" && (
          <MyAppointments
            onBack={() => setClientView("home")} // Passa a função de voltar
          />
        )}
    </View>
  );
}
