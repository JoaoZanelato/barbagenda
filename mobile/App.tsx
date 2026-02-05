import React from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import {
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

import { Routes } from "./src/routes";
import { AuthProvider, useAuth } from "./src/context/AuthContext"; // 👈 Importe
import { colors } from "./src/theme/colors";

SplashScreen.preventAutoHideAsync();

// Componente intermediário para pegar o Auth
function Main() {
  const { userRole, loading } = useAuth();
  return <Routes userRole={userRole} loading={loading} />;
}

export default function App() {
  let [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <View
        style={{ flex: 1, backgroundColor: colors.background }}
        onLayout={SplashScreen.hideAsync}
      >
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <Main />
      </View>
    </AuthProvider>
  );
}
