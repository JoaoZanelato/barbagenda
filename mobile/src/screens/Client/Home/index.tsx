import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Search, MapPin, Star, Heart } from "lucide-react-native";
import { styles } from "./styles";
import { useClientHome } from "./useClientHome";
import { colors } from "../../../theme/colors";
import { SchedulingModal } from "../../../components/SchedulingModal";

export function ClientHome() {
  const {
    tenants,
    user, // Pegamos o usuário daqui
    loading,
    selectedTenant,
    isModalOpen,
    handleSelectTenant,
    handleCloseModal,
    handleSuccess,
    favorites,
    toggleFavorite,
    showFavoritesOnly,
    setShowFavoritesOnly,
  } = useClientHome();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 100 }}
        />
      </View>
    );
  }

  const firstName = user?.name ? user.name.split(" ")[0] : "Cliente";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {firstName}</Text>
          <Text style={styles.title}>Encontre sua barbearia</Text>
        </View>

        {/* FOTO DO PERFIL (Vem do Banco) */}
        {user?.avatar_url ? (
          <Image source={{ uri: user.avatar_url }} style={styles.userAvatar} />
        ) : (
          <View
            style={[
              styles.userAvatar,
              {
                backgroundColor: "#27272A",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Text
              style={{
                color: colors.primary,
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {firstName[0]}
            </Text>
          </View>
        )}
      </View>

      {/* Busca */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#71717A" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Buscar barbearia..."
          placeholderTextColor="#71717A"
          style={styles.searchInput}
        />
      </View>

      {/* Filtro de Favoritos */}
      <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <Heart
            size={16}
            color={showFavoritesOnly ? "#EF4444" : "#71717A"}
            fill={showFavoritesOnly ? "#EF4444" : "transparent"}
          />
          <Text style={{ color: showFavoritesOnly ? "#EF4444" : "#71717A" }}>
            {showFavoritesOnly
              ? "Mostrando apenas favoritos"
              : "Mostrar favoritos"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleSelectTenant(item)}
          >
            {/* Logo da Barbearia */}
            {item.logo_url ? (
              <Image
                source={{ uri: item.logo_url }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.cardImage,
                  {
                    backgroundColor: "#27272A",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text
                  style={{ color: "#52525B", fontSize: 24, fontWeight: "bold" }}
                >
                  {item.name[0]}
                </Text>
              </View>
            )}

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>

                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <Heart
                    size={20}
                    color={favorites.includes(item.id) ? "#EF4444" : "#71717A"}
                    fill={
                      favorites.includes(item.id) ? "#EF4444" : "transparent"
                    }
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.rating}>
                  <Star size={12} color="#71717A" />
                  <Text
                    style={[
                      styles.ratingText,
                      { color: "#71717A", fontWeight: "normal" },
                    ]}
                  >
                    Nenhuma avaliação ainda
                  </Text>
                </View>
              </View>

              {item.address && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 6,
                    gap: 4,
                  }}
                >
                  <MapPin size={12} color="#71717A" />
                  <Text
                    style={{ color: "#71717A", fontSize: 12 }}
                    numberOfLines={1}
                  >
                    {item.address}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
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
