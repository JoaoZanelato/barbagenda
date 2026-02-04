import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090B",
  },
  coverImage: {
    width: "100%",
    height: 250,
    backgroundColor: "#27272A",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  scrollContent: {
    flex: 1,
    padding: 20,
    marginTop: -20,
    backgroundColor: "#09090B",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  ratingText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingCount: {
    color: "#71717A",
  },
  addressContainer: {
    marginTop: 24,
    backgroundColor: "#18181B",
    padding: 16,
    borderRadius: 12,
  },
  addressLabel: {
    color: "#A1A1AA",
    fontSize: 14,
  },
  addressText: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 2,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  mapButtonText: {
    color: "#22C55E",
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    color: "#71717A",
  },
  reviewCard: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#27272A",
    paddingBottom: 12,
  },
  reviewName: {
    color: "#FFF",
    fontWeight: "bold",
  },
  reviewComment: {
    color: "#A1A1AA",
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "#09090B",
    borderTopWidth: 1,
    borderTopColor: "#27272A",
  },
});
