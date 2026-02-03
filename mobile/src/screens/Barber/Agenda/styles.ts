import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#09090B", paddingTop: 60 },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  listContent: { padding: 20, paddingBottom: 100 },
  emptyText: { color: "#52525B", textAlign: "center", marginTop: 50 },

  card: {
    backgroundColor: "#18181B",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#27272A",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: { flexDirection: "row", alignItems: "center", gap: 12 },

  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#27272A",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: { color: "#A1A1AA", fontWeight: "bold" },

  clientName: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  serviceText: { color: "#A1A1AA", fontSize: 14 },

  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#27272A",
    padding: 6,
    borderRadius: 6,
  },
  timeText: { color: "#FFF", fontWeight: "bold" },

  actionsContainer: { flexDirection: "row", marginTop: 16, gap: 10 },

  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "rgba(239,68,68,0.1)",
    borderRadius: 8,
    gap: 6,
  },
  cancelText: { color: "#EF4444", fontWeight: "bold" },

  completeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "rgba(16,185,129,0.1)",
    borderRadius: 8,
    gap: 6,
  },
  completeText: { color: "#10B981", fontWeight: "bold" },
});
