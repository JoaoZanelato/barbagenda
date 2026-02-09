import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090B",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 14,
    color: "#A1A1AA",
    marginTop: 4,
  },

  // Lista
  scrollContent: {
    paddingBottom: 100,
  },

  // Card do Dia
  dayCard: {
    backgroundColor: "#18181B",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#27272A",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  switchContainer: {
    transform: [{ scale: 0.8 }],
  },

  // Inputs de Horário
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 10,
  },
  timeInputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#71717A",
    marginBottom: 4,
  },
  timeInput: {
    backgroundColor: "#27272A",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "#FFF",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    width: 10,
    height: 1,
    backgroundColor: "#3F3F46",
    marginTop: 18,
  },

  // Rodapé Salvar
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
});
