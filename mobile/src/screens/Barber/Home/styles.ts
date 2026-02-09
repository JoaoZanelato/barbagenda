import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    color: colors.text,
    fontFamily: "Inter_700Bold",
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 24,
    backgroundColor: "#18181B",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  activeTabText: {
    color: colors.background,
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  dateFilter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#18181B",
    padding: 16,
    borderRadius: 12,
  },
  dateText: {
    color: colors.text,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    textTransform: "capitalize",
  },
  dateSubText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },

  // CARD
  card: {
    backgroundColor: "#18181B",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#27272A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  avatarLetter: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  cardDesc: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  timeText: {
    color: colors.text,
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },

  // FAB (Floating Action Button)
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#18181B",
    borderRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    color: colors.text,
    fontFamily: "Inter_700Bold",
    marginBottom: 24,
    textAlign: "center",
  },
  closeBtn: {
    marginTop: 16,
    alignItems: "center",
    padding: 12,
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});
