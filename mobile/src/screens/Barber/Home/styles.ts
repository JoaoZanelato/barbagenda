import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: colors.text },
  tabs: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 6,
    borderRadius: 6,
  },
  activeTab: { backgroundColor: colors.primary },
  tabText: { color: colors.textSecondary, fontWeight: "bold", fontSize: 12 },
  activeTabText: { color: colors.black, fontWeight: "bold", fontSize: 12 },

  // Cards
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  timeBox: {
    backgroundColor: colors.surfaceHighlight,
    padding: 8,
    borderRadius: 6,
    marginRight: 12,
  },
  timeText: { color: colors.text, fontWeight: "bold" },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: "bold" },
  cardDesc: { color: colors.textSecondary, fontSize: 14 },
  priceText: { color: colors.primary, fontWeight: "bold", fontSize: 16 },
  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 20,
  },

  // Metrics
  metricsContainer: { gap: 16 },
  metricCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  metricLabel: { color: colors.textSecondary, fontSize: 14, marginBottom: 8 },
  metricValue: { color: colors.text, fontSize: 32, fontWeight: "bold" },
});
