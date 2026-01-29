import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";
import { fontFamily } from "../../../theme/fonts";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },

  headerTitle: {
    fontFamily: fontFamily.heading,
    fontSize: 28,
    color: colors.primary,
  },

  // Tabs Estilizadas
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 4,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },

  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
    borderRadius: 2,
  },

  activeTab: {
    backgroundColor: colors.primary,
  },

  tabText: {
    fontFamily: fontFamily.body,
    color: colors.textSecondary,
    fontSize: 12,
  },

  activeTabText: {
    fontFamily: fontFamily.bodyBold,
    color: colors.background, // Texto preto no fundo dourado
    fontSize: 12,
  },

  // Cards da Lista (Agenda/Serviços)
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 4,
    marginBottom: 12,
    borderLeftWidth: 3, // Detalhe lateral elegante
    borderLeftColor: colors.primary,
  },

  timeBox: {
    backgroundColor: "rgba(212, 175, 55, 0.1)", // Dourado bem transparente
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },

  timeText: {
    color: colors.primary,
    fontFamily: fontFamily.bodyBold,
  },

  cardTitle: {
    fontFamily: fontFamily.bodyBold,
    color: colors.text,
    fontSize: 16,
  },

  cardDesc: {
    fontFamily: fontFamily.body,
    color: colors.textSecondary,
    fontSize: 14,
  },

  priceText: {
    color: colors.primary,
    fontFamily: fontFamily.bodyBold,
    fontSize: 16,
  },

  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 20,
    fontFamily: fontFamily.body,
  },

  // Métricas
  metricsContainer: { gap: 16 },
  metricCard: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    fontFamily: fontFamily.body,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  metricValue: {
    color: colors.primary,
    fontSize: 36,
    fontFamily: fontFamily.heading,
  },
});
