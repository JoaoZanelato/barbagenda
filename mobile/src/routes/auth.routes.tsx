import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Welcome } from "../screens/Welcome";
import { ClientAuth } from "../screens/Client/Auth";
import { BarberAuth } from "../screens/Barber/Auth";

const Stack = createNativeStackNavigator();

export function AuthRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="ClientAuth" component={ClientAuth} />
      <Stack.Screen name="BarberAuth" component={BarberAuth} />
    </Stack.Navigator>
  );
}
