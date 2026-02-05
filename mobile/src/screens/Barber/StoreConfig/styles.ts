import { StyleSheet, Platform } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header fixo no topo
  header: {
    paddingHorizontal: 24,
    // Ajuste dinâmico para iPhone (notch) e Android
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "#27272A",
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontFamily: "PlayfairDisplay_700Bold",
  },

  content: {
    padding: 24,
  },

  // Área da Logo
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#18181B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#3F3F46",
    position: "relative", // Para o badge funcionar
  },
  logoImage: {
    width: 116,
    height: 116,
    borderRadius: 58,
  },
  placeholderLogo: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary, // Dourado
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },

  // Agrupamento de campos
  formGroup: {
    marginBottom: 24,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // Linhas
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Botão GPS Personalizado
  gpsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(212, 175, 55, 0.1)", // Dourado bem fraquinho
    padding: 14,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: "dashed",
  },
  gpsButtonActive: {
    backgroundColor: "rgba(16, 185, 129, 0.1)", // Verde fraquinho
    borderColor: "#10B981",
    borderStyle: "solid",
  },
  gpsText: {
    color: colors.primary,
    fontFamily: "Montserrat_700Bold",
    fontSize: 14,
  },

  footer: {
    marginTop: 12,
    gap: 16,
  },

  logoutButton: {
    alignItems: "center",
    padding: 16,
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "bold",
    fontFamily: "Montserrat_700Bold",
  },
});
