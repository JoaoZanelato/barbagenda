import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Home, Store } from "lucide-react-native"; // Removemos Calendar
import { styles } from "./styles";
import { colors } from "../../theme/colors";

interface Props {
  activeTab: "home" | "store"; // Removemos 'agenda'
  onChangeTab: (tab: "home" | "store") => void;
}

export function BarberBottomMenu({ activeTab, onChangeTab }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={() => onChangeTab("home")}>
        <Home
          size={24}
          color={activeTab === "home" ? colors.primary : "#71717A"}
        />
        <Text style={[styles.text, activeTab === "home" && styles.activeText]}>
          Início
        </Text>
      </TouchableOpacity>

      {/* Botão Agenda REMOVIDO daqui pois já existe dentro do Início */}

      <TouchableOpacity style={styles.tab} onPress={() => onChangeTab("store")}>
        <Store
          size={24}
          color={activeTab === "store" ? colors.primary : "#71717A"}
        />
        <Text style={[styles.text, activeTab === "store" && styles.activeText]}>
          Loja
        </Text>
      </TouchableOpacity>
    </View>
  );
}
