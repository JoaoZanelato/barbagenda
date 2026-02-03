import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Home, Calendar, User } from "lucide-react-native";
import { styles } from "./styles";
import { colors } from "../../theme/colors";

interface Props {
  activeTab: "home" | "appointments" | "profile";
  onChangeTab: (tab: "home" | "appointments" | "profile") => void;
}

export function BottomMenu({ activeTab, onChangeTab }: Props) {
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

      <TouchableOpacity
        style={styles.tab}
        onPress={() => onChangeTab("appointments")}
      >
        <Calendar
          size={24}
          color={activeTab === "appointments" ? colors.primary : "#71717A"}
        />
        <Text
          style={[
            styles.text,
            activeTab === "appointments" && styles.activeText,
          ]}
        >
          Agenda
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => onChangeTab("profile")}
      >
        <User
          size={24}
          color={activeTab === "profile" ? colors.primary : "#71717A"}
        />
        <Text
          style={[styles.text, activeTab === "profile" && styles.activeText]}
        >
          Perfil
        </Text>
      </TouchableOpacity>
    </View>
  );
}
