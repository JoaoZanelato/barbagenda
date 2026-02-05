import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#09090B" },

  // === ZONA DE SEGURANÇA ===
  // O padding cria uma borda transparente.
  // O minWidth força o Android a reservar espaço mesmo se a imagem demorar.
  markerSafeZone: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 90, // Tamanho bruto
    minHeight: 90, // Tamanho bruto
  },

  // A Bolha (Imagem + Borda)
  profileBubble: {
    width: 60,
    height: 60,
    borderRadius: 30, // Redondo perfeito
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: "#18181B",
    alignItems: "center",
    justifyContent: "center",
    // IMPORTANTE: Sem overflow: hidden para não bugar o Android
  },

  // A Imagem
  profileImage: {
    width: 54,
    height: 54,
    borderRadius: 27, // A imagem se arredonda sozinha
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
