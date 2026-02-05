import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Map as MapIcon, Calendar, User } from "lucide-react-native";
import { colors } from "../theme/colors";

import { ClientHome } from "../screens/Client/Home";
import { ClientMap } from "../screens/Client/Map";
import { MyAppointments } from "../screens/Client/MyAppointments";
import { Profile } from "../screens/Client/Profile";

const Tab = createBottomTabNavigator();

export function ClientRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Só ícones, estilo app moderno
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
      <Tab.Screen
        name="Home"
        component={ClientHome}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Map"
        component={ClientMap}
        options={{
          tabBarIcon: ({ color }) => <MapIcon color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={MyAppointments}
        options={{
          tabBarIcon: ({ color }) => <Calendar color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
}
