import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Store, Clock } from "lucide-react-native";
import { colors } from "../theme/colors";

// Importação das telas
import { BarberDashboard } from "../screens/Barber/Home";
import { StoreConfig } from "../screens/Barber/StoreConfig";
import { Availability } from "../screens/Barber/Availability"; // <--- Importe a nova tela

const Tab = createBottomTabNavigator();

export function BarberRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#18181B",
          borderTopColor: "#27272A",
          height: 60,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#71717A",
      }}
    >
      {/* Tela Principal (Home) */}
      <Tab.Screen
        name="BarberHome"
        component={BarberDashboard}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />

      {/* Tela de Configuração da Loja */}
      <Tab.Screen
        name="StoreConfig"
        component={StoreConfig}
        options={{
          tabBarIcon: ({ color }) => <Store color={color} size={24} />,
        }}
      />

      {/* Tela de Disponibilidade (Horários)
         Truque: Adicionamos aqui para ficar registrada na navegação,
         mas usamos 'tabBarButton: () => null' para NÃO aparecer ícone no rodapé.
      */}
      <Tab.Screen
        name="Availability"
        component={Availability}
        options={{
          tabBarButton: () => null, // Esconde o botão na barra inferior
          tabBarStyle: { display: "none" }, // Esconde a barra inferior quando estiver nessa tela (opcional)
        }}
      />
    </Tab.Navigator>
  );
}
