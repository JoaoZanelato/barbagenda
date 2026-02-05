import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Store } from "lucide-react-native";
import { colors } from "../theme/colors";

import { BarberDashboard } from "../screens/Barber/Home";
import { StoreConfig } from "../screens/Barber/StoreConfig";

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
      <Tab.Screen
        name="BarberHome"
        component={BarberDashboard}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="StoreConfig"
        component={StoreConfig}
        options={{
          tabBarIcon: ({ color }) => <Store color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
}
