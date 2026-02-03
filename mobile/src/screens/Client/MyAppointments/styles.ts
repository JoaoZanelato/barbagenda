import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#09090B" },
  center: {
    flex: 1,
    backgroundColor: "#09090B",
    justifyContent: "center",
    alignItems: "center",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#18181B",
  },
  backButton: { padding: 8, marginLeft: -8 },
  title: { color: "#FFF", fontSize: 18, fontWeight: "bold" },

  // Tabs
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#18181B",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#27272A",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: "#71717A",
    fontWeight: "600",
    fontSize: 14,
  },
  activeTabText: {
    color: "#FFF",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptySub: {
    color: "#A1A1AA",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },

  // Cards
  card: {
    backgroundColor: "#18181B",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#27272A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDimmed: { opacity: 0.6 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 6,
    textTransform: "uppercase",
  },
  price: { color: "#FFF", fontWeight: "bold", fontSize: 16 },

  shopName: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },

  divider: { height: 1, backgroundColor: "#27272A", marginBottom: 12 },

  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoText: { color: "#E4E4E7", marginLeft: 10, fontSize: 14 },

  cancelButton: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 8,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  cancelText: { color: "#EF4444", fontWeight: "bold", fontSize: 14 },
});
