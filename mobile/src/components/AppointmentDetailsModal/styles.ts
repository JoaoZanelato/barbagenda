import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#18181B",
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 450, // Garante altura mínima
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#27272A",
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 4,
  },

  // Cliente
  clientSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#27272A",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
  },
  clientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  clientPhone: {
    fontSize: 14,
    color: "#A1A1AA",
    marginTop: 2,
  },

  // Info
  infoContainer: {
    gap: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27272A",
    padding: 12,
    borderRadius: 8,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#A1A1AA",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },

  // Botões
  actions: {
    gap: 12,
    marginTop: 10,
  },
  completeButton: {
    backgroundColor: "#22C55E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  completeText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  cancelText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  statusBadge: {
    marginTop: 20,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#27272A",
    borderRadius: 8,
  },
});
