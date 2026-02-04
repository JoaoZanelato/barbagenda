import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  DeviceEventEmitter,
} from "react-native";
import { Search, MapPin, Star, Heart } from "lucide-react-native";
import { styles } from "./styles";
import { useClientHome } from "./useClientHome";
import { colors } from "../../../theme/colors";
import { useNotifications } from "../../../hooks/useNotifications";

// Componentes
import { SchedulingModal } from "../../../components/SchedulingModal";
import { TenantProfileModal } from "../../../components/TenantProfileModal";
import { BottomMenu } from "../../../components/BottomMenu";
import { MyAppointments } from "../MyAppointments";
import { Profile } from "../Profile";
import { ClientMap } from "../Map"; // 👈 Importe o Mapa

interface Props {
  onLogout: () => void;
}

export function ClientHome({ onLogout }: Props) {
  useNotifications(false);

  // Controle de Abas
  const [activeTab, setActiveTab] = useState<
    "home" | "map" | "appointments" | "profile"
  >("home");
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

  // Ouvinte de Notificação para troca de aba
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      "notification_navigate",
      (screen) => {
        if (screen === "ClientAppointments") setActiveTab("appointments");
      },
    );
    return () => sub.remove();
  }, []);

  // Handler unificado para abrir perfil (vindo da lista ou do mapa)
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

  // --- RENDERIZAÇÃO DAS ABAS ---

  const renderHomeContent = () => {
    const firstName = user?.name ? user.name.split(" ")[0] : "Cliente";
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {firstName}</Text>
            <Text style={styles.title}>Encontre sua barbearia</Text>
          </View>
          {user?.avatar_url ? (
            <Image
              source={{ uri: user.avatar_url }}
              style={styles.userAvatar}
            />
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

        <View style={styles.searchContainer}>
          <Search size={20} color="#71717A" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Buscar barbearia..."
            placeholderTextColor="#71717A"
            style={styles.searchInput}
          />
        </View>

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
              {showFavoritesOnly ? "Mostrando favoritos" : "Mostrar favoritos"}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tenants}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => onOpenTenant(item)}
            >
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
                    style={{
                      color: "#52525B",
                      fontSize: 24,
                      fontWeight: "bold",
                    }}
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
                      color={
                        favorites.includes(item.id) ? "#EF4444" : "#71717A"
                      }
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
                      Ver detalhes
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
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#09090B" }}>
      {/* Conteúdo Principal */}
      <View style={{ flex: 1 }}>
        {activeTab === "home" && renderHomeContent()}

        {/* 👇 Nova Aba Mapa */}
        {activeTab === "map" && (
          <ClientMap tenants={tenants} onSelectTenant={onOpenTenant} />
        )}

        {activeTab === "appointments" && <MyAppointments />}
        {activeTab === "profile" && <Profile onLogout={onLogout} />}
      </View>

      {/* Menu Inferior */}
      <BottomMenu activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* --- MODAIS GLOBAIS (Funcionam na Home e no Mapa) --- */}
      {selectedTenant && (
        <>
          <TenantProfileModal
            isVisible={showProfileModal}
            tenant={selectedTenant}
            onClose={() => setShowProfileModal(false)}
            onSchedule={() => setShowProfileModal(false)} // Fecha perfil, SchedulingModal já abre via hook
          />

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
