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

  listContent: { paddingBottom: 20, gap: 12 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceHighlight,
  },

  avatar: {
    width: 48,
    height: 48,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.primary, fontWeight: "bold", fontSize: 20 },

  cardTitle: { color: colors.text, fontSize: 16, fontWeight: "bold" },
  cardDesc: { color: colors.textSecondary, fontSize: 14 },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
  },
});
