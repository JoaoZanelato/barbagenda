import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontFamily: "PlayfairDisplay_700Bold",
  },

  tabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#27272A",
    gap: 6,
  },
  activeTab: { backgroundColor: colors.primary },
  tabText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },
  activeTabText: {
    color: colors.background,
    fontSize: 14,
    fontFamily: "Montserrat_700Bold",
  },

  // Filtro de Data
  dateFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateText: {
    color: colors.text,
    fontSize: 18,
    fontFamily: "Montserrat_700Bold",
    textTransform: "capitalize",
  },
  dateSubText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: "Montserrat_400Regular",
  },

  // Card de Agendamento (Atualizado)
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181B",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272A",
  },

  // Avatar
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#27272A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarLetter: { color: "#A1A1AA", fontSize: 18, fontWeight: "bold" },

  // Info do Card
  timeBox: { alignItems: "flex-end", marginRight: 12 },
  timeText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },

  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontFamily: "Montserrat_700Bold",
  },
  cardDesc: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
  },

  // Status Badge
  statusBadge: {
    fontSize: 12,
    fontFamily: "Montserrat_700Bold",
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    overflow: "hidden",
  },

  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },

  // FAB e Modais
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  // Estilos do Modal (Mantidos)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { backgroundColor: "#18181B", borderRadius: 16, padding: 20 },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontFamily: "PlayfairDisplay_700Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  detailText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
  },
  divider: { height: 1, backgroundColor: "#27272A", marginVertical: 10 },
  actionButtons: { marginTop: 20 },
  closeBtn: { marginTop: 10, padding: 10, alignItems: "center" },
  closeText: { color: colors.textSecondary },

  // Métricas
  metricsContainer: { padding: 20 },
  metricCard: {
    backgroundColor: "#18181B",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#27272A",
    alignItems: "center",
  },
  metricLabel: { color: colors.textSecondary, fontSize: 14, marginBottom: 8 },
  metricValue: {
    color: colors.primary,
    fontSize: 32,
    fontFamily: "PlayfairDisplay_700Bold",
  },
});
