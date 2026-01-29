import { StyleSheet, Platform } from "react-native";
import { colors } from "../../../theme/colors";
import { fontFamily } from "../../../theme/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 60 : 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: fontFamily.heading,
    fontSize: 28,
    color: colors.primary,
  },

  // Tabs mais visíveis
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.surface, // Fundo cinza para a barra de abas
    borderRadius: 12,
    padding: 6,
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
    gap: 6,
    borderRadius: 8,
  },
  activeTab: { backgroundColor: colors.primary },
  tabText: {
    fontFamily: fontFamily.body,
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  activeTabText: {
    fontFamily: fontFamily.bodyBold,
    color: colors.background,
    fontSize: 11,
  },

  // --- CARD DE AGENDAMENTO ---
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface, // Cinza destacado
    padding: 16,
    borderRadius: 12,
    marginBottom: 16, // Mais espaçamento

    // Borda lateral grossa (indicador visual)
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,

    // Contorno sutil
    borderWidth: 1,
    borderTopColor: colors.borderSubtle,
    borderRightColor: colors.borderSubtle,
    borderBottomColor: colors.borderSubtle,

    // Profundidade
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // Caixa de Horário (Destaque)
  timeBox: {
    backgroundColor: colors.background, // Fundo preto dentro do card cinza
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: "center",
  },
  timeText: {
    color: colors.primary,
    fontFamily: fontFamily.bodyBold,
    fontSize: 16,
  },

  cardTitle: {
    fontFamily: fontFamily.bodyBold,
    color: colors.text,
    fontSize: 16,
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: fontFamily.body,
    color: colors.textSecondary,
    fontSize: 14,
  },

  statusBadge: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 10,
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.05)", // Badge sutil
    overflow: "hidden",
    textTransform: "uppercase",
  },

  // Filtro de Data
  dateFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primaryDark, // Borda dourada escura para destaque
  },
  dateText: {
    fontFamily: fontFamily.bodyBold,
    color: colors.text,
    fontSize: 16,
    textTransform: "capitalize",
  },
  dateSubText: {
    fontFamily: fontFamily.body,
    color: colors.textSecondary,
    fontSize: 12,
  },

  // FAB e Modais (Mantém estilos anteriores ou ajusta cores)
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    elevation: 10,
    zIndex: 10,
  },

  // Empty states
  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
    fontFamily: fontFamily.body,
  },

  // Métricas e Modais (Reutilizam lógica de cores)
  metricsContainer: { gap: 16 },
  metricCard: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 12,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  modalTitle: {
    fontFamily: fontFamily.heading,
    fontSize: 24,
    color: colors.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  detailText: { fontFamily: fontFamily.body, fontSize: 16, color: colors.text },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: 16,
  },
  actionButtons: { marginTop: 24, gap: 12 },
  closeBtn: { marginTop: 16, alignItems: "center", padding: 12 },
  closeText: { color: colors.textSecondary, fontFamily: fontFamily.body },
});
