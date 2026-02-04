import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Home, Calendar, User, Map } from "lucide-react-native"; // 👈 Ícone Map
import { styles } from "./styles";
import { colors } from "../../theme/colors";

interface Props {
  activeTab: "home" | "map" | "appointments" | "profile";
  onChangeTab: (tab: "home" | "map" | "appointments" | "profile") => void;
}

export function BottomMenu({ activeTab, onChangeTab }: Props) {
  // Função auxiliar para renderizar o item e evitar repetição de código
  const renderItem = (
    tab: "home" | "map" | "appointments" | "profile",
    label: string,
    IconComponent: any,
  ) => {
    const isActive = activeTab === tab;

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => onChangeTab(tab)}
        activeOpacity={0.7}
      >
        <IconComponent
          color={isActive ? colors.primary : colors.textSecondary}
          size={24}
          // Se quiser ícone preenchido quando ativo:
          // fill={isActive ? colors.primary : "transparent"}
        />
        <Text style={[styles.text, isActive && styles.activeText]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderItem("home", "Início", Home)}
      {renderItem("map", "Mapa", Map)}
      {renderItem("appointments", "Agenda", Calendar)}
      {renderItem("profile", "Perfil", User)}
    </View>
  );
}
