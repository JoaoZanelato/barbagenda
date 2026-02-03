import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { MapPin, Heart } from "lucide-react-native";
import { styles } from "./styles";
import { useClientHome } from "./useClientHome";
import { colors } from "../../../theme/colors";
import { useNotifications } from "../../../hooks/useNotifications";
import { SchedulingModal } from "../../../components/SchedulingModal";

export function ClientHome() {
  useNotifications(false);

  const {
    tenants,
    loading,
    selectedTenant,
    isModalOpen,
    favorites,
    showFavoritesOnly,
    setShowFavoritesOnly,
    toggleFavorite,
    handleSelectTenant,
    handleCloseModal,
    handleSuccess,
  } = useClientHome();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com Filtro de Favoritos */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Barbearias</Text>
        <TouchableOpacity
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <Heart
            size={24}
            color={showFavoritesOnly ? "#EF4444" : "#71717A"}
            fill={showFavoritesOnly ? "#EF4444" : "none"}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={styles.emptyText}>
              {showFavoritesOnly
                ? "Nenhum favorito ainda."
                : "Nenhuma barbearia encontrada."}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isFav = favorites.includes(item.id);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleSelectTenant(item)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.name ? item.name[0].toUpperCase() : "B"}
                </Text>
              </View>

              <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  <MapPin size={12} color={colors.primary} />
                  <Text style={styles.cardDesc}> Toque para agendar</Text>
                </View>
              </View>

              {/* Botão de Favoritar */}
              <TouchableOpacity
                onPress={() => toggleFavorite(item.id)}
                style={{ padding: 8 }}
              >
                <Heart
                  size={20}
                  color={isFav ? "#EF4444" : "#52525B"}
                  fill={isFav ? "#EF4444" : "none"}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />

      {selectedTenant && (
        <SchedulingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          tenantId={selectedTenant.id}
        />
      )}
    </View>
  );
}
