import { StyleSheet, Platform } from "react-native";
import { colors } from "../../../theme/colors";
import { fontFamily } from "../../../theme/fonts";

export const styles = StyleSheet.create({
  // ... (Container, Header, Tabs iguais ao anterior) ...
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
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 8,
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
    gap: 6,
    borderRadius: 6,
  },
  activeTab: { backgroundColor: colors.primary },
  tabText: {
    fontFamily: fontFamily.body,
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "600",
  },
  activeTabText: {
    fontFamily: fontFamily.bodyBold,
    color: colors.background,
    fontSize: 10,
  },

  // --- FILTRO DE DATA ---
  dateFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
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

  // --- CARDS ---
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  timeBox: {
    backgroundColor: "rgba(212, 175, 55, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  timeText: { color: colors.primary, fontFamily: fontFamily.bodyBold },
  cardTitle: {
    fontFamily: fontFamily.bodyBold,
    color: colors.text,
    fontSize: 16,
  },
  cardDesc: {
    fontFamily: fontFamily.body,
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },

  statusBadge: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 12,
    marginTop: 4,
    textTransform: "uppercase",
  },

  // --- MODAL DE DETALHES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.background,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
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
  detailText: {
    fontFamily: fontFamily.body,
    fontSize: 16,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: 16,
  },
  actionButtons: {
    marginTop: 24,
    gap: 12,
  },

  closeBtn: { marginTop: 16, alignItems: "center", padding: 12 },
  closeText: { color: colors.textSecondary, fontFamily: fontFamily.body },

  // Empty State & Metrics
  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
    fontFamily: fontFamily.body,
  },
  metricsContainer: { gap: 16 },
  metricCard: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 8,
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
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
});
