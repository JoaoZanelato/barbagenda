import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090B",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#09090B",
  },

  map: {
    width: "100%",
    height: "100%",
  },

  // === MARCADOR PERSONALIZADO (PINO) ===
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 60, // Área de toque maior
    height: 60,
  },

  markerImage: {
    width: 44,
    height: 44,
    borderRadius: 22, // Totalmente redonda
    borderWidth: 2,
    borderColor: colors.primary, // Borda Dourada
    backgroundColor: "#18181B",
  },

  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: colors.primary,
    transform: [{ rotate: "180deg" }], // Inverte para apontar pra baixo
    marginTop: -2, // Cola na bolinha
  },

  // === BOTÃO GPS ===
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
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
});
