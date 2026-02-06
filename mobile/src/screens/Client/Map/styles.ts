import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#09090B" },

  // Botão flutuante do GPS (única coisa customizada que sobrou)
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
