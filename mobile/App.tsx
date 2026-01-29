import React, { useState, useCallback, useEffect } from "react";
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
    return null; // Ou um loading spinner simples
  }

  // ... (O resto das funções handleLoginSuccess, handleLogout permanecem iguais)
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
    // Atualizei a cor de fundo para o novo preto profundo
    <View
      style={{ flex: 1, backgroundColor: colors.background }}
      onLayout={onLayoutRootView}
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* ... O RESTO DO SEU JSX DE NAVEGAÇÃO PERMANECE IGUAL ... */}
      {role === "none" && <Welcome onSelectRole={setRole} />}
      {/* etc... */}
    </View>
  );
}
