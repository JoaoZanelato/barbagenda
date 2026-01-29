import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Scissors, User, Briefcase } from "lucide-react-native";
import { styles } from "./styles";
import { colors } from "../../theme/colors";

interface Props {
  onSelectRole: (role: "barber" | "client") => void;
}

export function Welcome({ onSelectRole }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.logoArea}>
        <View style={styles.iconCircle}>
          <Scissors size={40} color={colors.black} />
        </View>
        <Text style={styles.title}>BarbAgenda</Text>
        <Text style={styles.subtitle}>Gestão e Agendamento Simplificado</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => onSelectRole("barber")}
        >
          <Briefcase size={32} color={colors.primary} />
          <View>
            <Text style={styles.cardTitle}>Sou Profissional</Text>
            <Text style={styles.cardDesc}>Gerenciar minha barbearia</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => onSelectRole("client")}
        >
          <User size={32} color={colors.primary} />
          <View>
            <Text style={styles.cardTitle}>Sou Cliente</Text>
            <Text style={styles.cardDesc}>Quero agendar um horário</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
