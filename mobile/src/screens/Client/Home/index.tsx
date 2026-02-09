import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // <--- IMPORTANTE
import { Search, MapPin, Star, Heart } from "lucide-react-native";
import { styles } from "./styles";
import { useClientHome } from "./useClientHome";
import { colors } from "../../../theme/colors";
import { useNotifications } from "../../../hooks/useNotifications";

import { TenantProfileModal } from "../../../components/TenantProfileModal";
import { SchedulingModal } from "../../../components/SchedulingModal";

export function ClientHome() {
  useNotifications(false);
  const navigation = useNavigation(); // <--- HOOK DE NAVEGAÇÃO

  const {
    tenants,
    loading,
    refreshing,
    onRefresh,
    user,
    favorites,
    toggleFavorite,
    showFavoritesOnly,
    setShowFavoritesOnly,
  } = useClientHome();

  // === LÓGICA DE MODAIS ===
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const handleOpenTenant = (tenant: any) => {
    setIsScheduleOpen(false);
    setSelectedTenant(tenant);
    setShowProfileModal(true);
  };

  const handleSchedule = () => {
    setShowProfileModal(false);
    setTimeout(() => {
      setIsScheduleOpen(true);
    }, 300);
  };

  const handleCloseSchedule = () => {
    setIsScheduleOpen(false);
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

  const firstName = user?.name ? user.name.split(" ")[0] : "Cliente";

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {firstName}</Text>
          <Text style={styles.title}>Encontre sua barbearia</Text>
        </View>

        {/* BOTÃO DE PERFIL COM NAVEGAÇÃO */}
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={() => navigation.navigate("Profile" as never)} // <--- AÇÃO DE CLIQUE ADICIONADA
        >
          {user?.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatar,
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
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#52525B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar barbearia..."
          placeholderTextColor="#52525B"
        />
      </View>

      {/* FILTER */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            showFavoritesOnly && styles.filterButtonActive,
          ]}
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          <Heart
            size={16}
            color={showFavoritesOnly ? "#FFF" : "#A1A1AA"}
            fill={showFavoritesOnly ? "#FFF" : "transparent"}
          />
          <Text
            style={[styles.filterText, showFavoritesOnly && { color: "#FFF" }]}
          >
            {showFavoritesOnly ? "Meus Favoritos" : "Filtrar Favoritos"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <Text style={{ color: "#52525B" }}>
              Nenhuma barbearia encontrada.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handleOpenTenant(item)}
          >
            <Image
              source={{
                uri:
                  item.cover_url ||
                  item.logo_url ||
                  `https://ui-avatars.com/api/?background=D4AF37&color=fff&name=${item.name}`,
              }}
              style={styles.coverImage}
              resizeMode="cover"
            />

            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(item.id)}
            >
              <Heart
                size={20}
                color={favorites.includes(item.id) ? "#EF4444" : "#FFF"}
                fill={favorites.includes(item.id) ? "#EF4444" : "transparent"}
              />
            </TouchableOpacity>

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={12} color="#EAB308" fill="#EAB308" />
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
              </View>

              <View style={styles.cardAddress}>
                <MapPin size={14} color="#52525B" />
                <Text style={styles.addressText} numberOfLines={1}>
                  {item.address || "Endereço indisponível"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* MODAIS */}
      {selectedTenant && (
        <>
          <TenantProfileModal
            isVisible={showProfileModal}
            tenant={selectedTenant}
            onClose={() => setShowProfileModal(false)}
            onSchedule={handleSchedule}
          />

          {isScheduleOpen && (
            <SchedulingModal
              isOpen={true}
              onClose={handleCloseSchedule}
              onSuccess={() => {
                handleCloseSchedule();
                onRefresh();
              }}
              tenantId={selectedTenant.id}
            />
          )}
        </>
      )}
    </View>
  );
}
