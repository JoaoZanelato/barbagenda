import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { User, Briefcase } from "lucide-react-native";
import { styles } from "./styles";
import { colors } from "../../theme/colors";

interface Props {
  onSelectRole: (role: "barber" | "client") => void;
}

export function Welcome({ onSelectRole }: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <View style={styles.logoArea}>
        <Image
          source={require("../../../assets/images/icon.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>BarbAgenda</Text>
        <Text style={styles.subtitle}>Gestão e Estilo Exclusivos</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => onSelectRole("barber")}
        >
          <View style={styles.iconBox}>
            <Briefcase size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.cardTitle}>Área do Profissional</Text>
            <Text style={styles.cardDesc}>Gestão administrativa</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => onSelectRole("client")}
        >
          <View style={styles.iconBox}>
            <User size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.cardTitle}>Área do Cliente</Text>
            <Text style={styles.cardDesc}>Agendar um horário</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 👇 COPYRIGHT AQUI */}
      <Text style={styles.footer}>© {currentYear} BarbAgenda Inc.</Text>
    </View>
  );
}
