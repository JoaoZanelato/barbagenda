import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#09090B" },

  // ZONA DE SEGURANÇA
  // O padding: 10 cria uma área transparente em volta.
  // O minWidth/Height força o Android a reservar espaço antes mesmo da imagem chegar.
  markerSafeZone: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80, // Força bruta de tamanho
    minHeight: 80, // Força bruta de tamanho
  },

  // A Bolha Visível
  profileBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: "#18181B",
    alignItems: "center",
    justifyContent: "center",
  },

  // A Imagem
  profileImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },

  gpsButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#27272A",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3F3F46",
    elevation: 5,
  },
});
