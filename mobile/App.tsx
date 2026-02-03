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

// Telas GERAIS
import { Welcome } from "./src/screens/Welcome";
import { colors } from "./src/theme/colors";

// Telas do CLIENTE
import { ClientAuth } from "./src/screens/Client/Auth";
import { ClientHome } from "./src/screens/Client/Home";
import { MyAppointments } from "./src/screens/Client/MyAppointments";
import { Profile } from "./src/screens/Client/Profile";
import { BottomMenu } from "./src/components/BottomMenu";

// Telas do BARBEIRO
import { BarberAuth } from "./src/screens/Barber/Auth";
import { BarberDashboard } from "./src/screens/Barber/Home"; // O Dashboard Completo (Início)
import { StoreConfig } from "./src/screens/Barber/StoreConfig"; // Configuração da Loja
import { BarberBottomMenu } from "./src/components/BarberBottomMenu"; // Menu Inferior

SplashScreen.preventAutoHideAsync();

// Tipagens de Estado
type Role = "none" | "barber" | "client";
type AuthState = "guest" | "authenticated";
type ClientTab = "home" | "appointments" | "profile";
type BarberTab = "home" | "store"; // Apenas Início (Dashboard) e Loja (Config)

export default function App() {
  // Controle de Acesso
  const [role, setRole] = useState<Role>("none");
  const [auth, setAuth] = useState<AuthState>("guest");

  // Controle de Navegação (Abas)
  const [clientTab, setClientTab] = useState<ClientTab>("home");
  const [barberTab, setBarberTab] = useState<BarberTab>("home");

  // Carregamento de Fontes
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

  // Login com Sucesso
  const handleLoginSuccess = (token: string) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setAuth("authenticated");

    // Reseta abas para a inicial
    setClientTab("home");
    setBarberTab("home");
  };

  // Logout
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

      {/* ================================================= */}
      {/* 1. TELA INICIAL (Escolha de Perfil) */}
      {/* ================================================= */}
      {role === "none" && <Welcome onSelectRole={setRole} />}

      {/* ================================================= */}
      {/* 💈 ÁREA DO BARBEIRO */}
      {/* ================================================= */}

      {/* Login do Barbeiro */}
      {role === "barber" && auth === "guest" && (
        <BarberAuth
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setRole("none")}
        />
      )}

      {/* Barbeiro Logado */}
      {role === "barber" && auth === "authenticated" && (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {/* ROTEAMENTO DAS ABAS DO BARBEIRO */}

            {/* Aba 'home': Mostra o Dashboard Completo (Agenda, Serviços, Equipe, Métricas) */}
            {barberTab === "home" && (
              <BarberDashboard onLogout={handleLogout} />
            )}

            {/* Aba 'store': Mostra Configuração da Loja (Foto, Endereço) */}
            {barberTab === "store" && <StoreConfig onLogout={handleLogout} />}
          </View>

          {/* Menu Inferior Personalizado */}
          <BarberBottomMenu activeTab={barberTab} onChangeTab={setBarberTab} />
        </View>
      )}

      {/* ================================================= */}
      {/* 👤 ÁREA DO CLIENTE */}
      {/* ================================================= */}

      {/* Login do Cliente */}
      {role === "client" && auth === "guest" && (
        <ClientAuth
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setRole("none")}
        />
      )}

      {/* Cliente Logado */}
      {role === "client" && auth === "authenticated" && (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {/* ROTEAMENTO DAS ABAS DO CLIENTE */}
            {clientTab === "home" && <ClientHome />}
            {clientTab === "appointments" && (
              <MyAppointments onBack={() => setClientTab("home")} />
            )}
            {clientTab === "profile" && <Profile onLogout={handleLogout} />}
          </View>

          {/* Menu Inferior Padrão */}
          <BottomMenu activeTab={clientTab} onChangeTab={setClientTab} />
        </View>
      )}
    </View>
  );
}
