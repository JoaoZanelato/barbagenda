import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LogOut, MapPin, Calendar as CalendarIcon } from "lucide-react-native";
import { styles } from "./styles";
import { useClientHome } from "./useClientHome";
import { colors } from "../../../theme/colors";
import { useNotifications } from "../../../hooks/useNotifications";
import { SchedulingModal } from "../../../components/SchedulingModal";

interface Props {
  onLogout: () => void;
  onGoToAppointments: () => void; // 👈 Nova Propriedade Obrigatória
}

export function ClientHome({ onLogout, onGoToAppointments }: Props) {
  useNotifications(false);

  const {
    tenants,
    loading,
    selectedTenant,
    isModalOpen,
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Barbearias</Text>
        <TouchableOpacity onPress={onLogout}>
          <LogOut size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* Botão Corrigido */}
      <TouchableOpacity
        style={{
          backgroundColor: "#27272A",
          margin: 20,
          marginBottom: 10,
          padding: 15,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "#3F3F46",
        }}
        onPress={onGoToAppointments} // 👈 Chama a função direta do App.tsx
      >
        <CalendarIcon
          size={20}
          color={colors.primary}
          style={{ marginRight: 10 }}
        />
        <Text style={{ color: "#FFF", fontWeight: "bold" }}>
          Ver Meus Agendamentos
        </Text>
      </TouchableOpacity>

      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma barbearia encontrada.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleSelectTenant(item)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.name ? item.name[0].toUpperCase() : "B"}
              </Text>
            </View>
            <View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MapPin size={12} color={colors.primary} />
                <Text style={styles.cardDesc}> Toque para agendar</Text>
              </View>
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
