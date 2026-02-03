import React, { useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import api from "./src/services/API";

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
import { MyAppointments } from "./src/screens/Client/MyAppointments";
import { Profile } from "./src/screens/Client/Profile"; // Nova tela
import { BarberAuth } from "./src/screens/Barber/Auth";
import { BarberDashboard } from "./src/screens/Barber/Home";
import { BottomMenu } from "./src/components/BottomMenu"; // Novo componente
import { colors } from "./src/theme/colors";

SplashScreen.preventAutoHideAsync();

type Role = "none" | "barber" | "client";
type AuthState = "guest" | "authenticated";
type ClientTab = "home" | "appointments" | "profile"; // Abas disponíveis

export default function App() {
  const [role, setRole] = useState<Role>("none");
  const [auth, setAuth] = useState<AuthState>("guest");

  // Controle da aba ativa do cliente
  const [activeTab, setActiveTab] = useState<ClientTab>("home");

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

  if (!fontsLoaded) return null;

  const handleLoginSuccess = (token: string) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setAuth("authenticated");
    setActiveTab("home"); // Reseta para home ao logar
  };

  const handleLogout = () => {
    setAuth("guest");
    setRole("none");
    setActiveTab("home");
    api.defaults.headers.common["Authorization"] = "";
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background }}
      onLayout={onLayoutRootView}
    >
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* 1. SELEÇÃO DE PERFIL / LOGIN */}
      {role === "none" && <Welcome onSelectRole={setRole} />}

      {/* 2. ÁREA DO BARBEIRO */}
      {role === "barber" &&
        (auth === "guest" ? (
          <BarberAuth
            onLoginSuccess={handleLoginSuccess}
            onBack={() => setRole("none")}
          />
        ) : (
          <BarberDashboard onLogout={handleLogout} />
        ))}

      {/* 3. ÁREA DO CLIENTE */}
      {role === "client" && auth === "guest" && (
        <ClientAuth
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setRole("none")}
        />
      )}

      {/* 4. APP DO CLIENTE LOGADO (Com Navegação) */}
      {role === "client" && auth === "authenticated" && (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {/* Renderiza a tela baseada na aba ativa */}
            {activeTab === "home" && <ClientHome />}

            {activeTab === "appointments" && (
              <MyAppointments onBack={() => setActiveTab("home")} />
            )}

            {activeTab === "profile" && <Profile onLogout={handleLogout} />}
          </View>

          {/* Barra de Navegação Fixa */}
          <BottomMenu activeTab={activeTab} onChangeTab={setActiveTab} />
        </View>
      )}
    </View>
  );
}
