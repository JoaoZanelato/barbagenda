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

// Telas e Cores
import { Welcome } from "./src/screens/Welcome";
import { ClientAuth } from "./src/screens/Client/Auth";
import { ClientHome } from "./src/screens/Client/Home";
import { BarberAuth } from "./src/screens/Barber/Auth";
import { BarberDashboard } from "./src/screens/Barber/Home";
import { colors } from "./src/theme/colors";

// Mantém a splash screen visível enquanto carrega
SplashScreen.preventAutoHideAsync();

type Role = "none" | "barber" | "client";
type AuthState = "guest" | "authenticated";

export default function App() {
  const [role, setRole] = useState<Role>("none");
  const [auth, setAuth] = useState<AuthState>("guest");

  // Carregar Fontes
  let [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  // Esconde a splash screen quando as fontes estiverem prontas
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
    api.defaults.headers.common["Authorization"] = "";
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background }}
      onLayout={onLayoutRootView}
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* 1. Tela Inicial (Escolha de Perfil) */}
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
        <ClientHome onLogout={handleLogout} />
      )}
    </View>
  );
}
