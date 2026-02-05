import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { colors } from "../theme/colors";

import { AuthRoutes } from "./auth.routes";
import { ClientRoutes } from "./client.routes";
import { BarberRoutes } from "./barber.routes";

interface Props {
  userRole: "client" | "barber" | null;
  loading: boolean;
}

export function Routes({ userRole, loading }: Props) {
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#09090B",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userRole === "client" ? (
        <ClientRoutes />
      ) : userRole === "barber" ? (
        <BarberRoutes />
      ) : (
        <AuthRoutes />
      )}
    </NavigationContainer>
  );
}
