import { StyleSheet, Platform, StatusBar } from "react-native";

// Cálculo seguro da margem superior para não ficar embaixo do relógio
const ANDROID_STATUS_BAR = StatusBar.currentHeight || 24;
const IOS_STATUS_BAR = 60;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090B",
    paddingTop:
      Platform.OS === "android" ? ANDROID_STATUS_BAR + 10 : IOS_STATUS_BAR,
  },

  // === HEADER ===
  header: {
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: "#A1A1AA",
    fontFamily: "Inter_400Regular",
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    marginTop: 4,
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#27272A",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },

  // === BUSCA ===
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181B",
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#27272A",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },

  // === FILTRO ===
  filterContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterButtonActive: {
    opacity: 1,
  },
  filterText: {
    fontSize: 14,
    color: "#A1A1AA",
    fontFamily: "Inter_500Medium",
  },

  // === LISTA ===
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },

  // === CARD DA BARBEARIA ===
  card: {
    backgroundColor: "#18181B",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#27272A",
  },
  coverImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#27272A",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(234, 179, 8, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    color: "#EAB308",
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  cardAddress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  addressText: {
    color: "#A1A1AA",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
});
