import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#18181B",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "90%",
    width: "100%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceHighlight,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: "bold" },

  content: { padding: 20 },
  loadingContainer: { marginTop: 40 },

  stepTitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 12,
  },

  // Cards de Seleção
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.surfaceHighlight,
  },
  cardSelected: {
    backgroundColor: "rgba(234, 179, 8, 0.1)",
    borderColor: colors.primary,
  },
  cardText: { color: colors.textSecondary, fontSize: 16 },
  textSelected: { color: colors.text, fontWeight: "bold" },

  // Serviço
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  // Horários
  slotsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  slotBadge: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.surfaceHighlight,
    backgroundColor: colors.surface,
  },
  slotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceHighlight,
    backgroundColor: colors.background,
  },
  summaryText: {
    color: colors.text,
    textAlign: "right",
    marginTop: 10,
    fontWeight: "bold",
  },

  // Textos úteis
  textWhite: { color: colors.text },
  textGray: { color: colors.textSecondary },
  textGold: { color: colors.primary, fontWeight: "bold" },
  textBlack: { color: colors.black, fontWeight: "bold" },
});
