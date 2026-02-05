import React, { useState } from "react";
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
import { useNotifications } from "../../../hooks/useNotifications";

// Componentes e Modais
import { SchedulingModal } from "../../../components/SchedulingModal";
import { TenantProfileModal } from "../../../components/TenantProfileModal";

export function ClientHome() {
  // Ativa notificações (false = modo cliente)
  useNotifications(false);

  const [showProfileModal, setShowProfileModal] = useState(false);

  const {
    tenants,
    user,
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

  // Abre o perfil da barbearia
  const onOpenTenant = (tenant: any) => {
    handleSelectTenant(tenant);
    setShowProfileModal(true);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#09090B",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Pega o primeiro nome para exibir na saudação
  const firstName = user?.name ? user.name.split(" ")[0] : "Cliente";

  return (
    <View style={styles.container}>
      {/* === HEADER === */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {firstName}</Text>
          <Text style={styles.title}>Encontre sua barbearia</Text>
        </View>

        {/* Avatar do Usuário */}
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

      {/* === BUSCA === */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#71717A" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Buscar barbearia..."
          placeholderTextColor="#71717A"
          style={styles.searchInput}
        />
      </View>

      {/* === FILTRO DE FAVORITOS === */}
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
          <Text
            style={{
              color: showFavoritesOnly ? "#EF4444" : "#71717A",
              fontSize: 14,
            }}
          >
            {showFavoritesOnly ? "Mostrando favoritos" : "Mostrar favoritos"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* === LISTA DE BARBEARIAS === */}
      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text
            style={{ color: "#71717A", textAlign: "center", marginTop: 40 }}
          >
            Nenhuma barbearia encontrada.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onOpenTenant(item)}
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

            {/* Informações do Card */}
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.name}
                </Text>

                {/* Botão de Favoritar no Card */}
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
                  <Star size={12} color="#EAB308" fill="#EAB308" />
                  <Text style={styles.ratingText}>5.0</Text>
                  <Text
                    style={[
                      styles.ratingText,
                      { color: "#71717A", marginLeft: 4, fontWeight: "normal" },
                    ]}
                  >
                    • Ver detalhes
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
                    style={{ color: "#71717A", fontSize: 12, flex: 1 }}
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

      {/* === MODAIS === */}
      {selectedTenant && (
        <>
          {/* Modal de Perfil da Barbearia (Serviços, Info) */}
          <TenantProfileModal
            isVisible={showProfileModal}
            tenant={selectedTenant}
            onClose={() => setShowProfileModal(false)}
            onSchedule={() => setShowProfileModal(false)}
          />

          {/* Modal de Agendamento (Horários) */}
          <SchedulingModal
            isOpen={isModalOpen && !showProfileModal}
            onClose={handleCloseModal}
            onSuccess={handleSuccess}
            tenantId={selectedTenant.id}
          />
        </>
      )}
    </View>
  );
}