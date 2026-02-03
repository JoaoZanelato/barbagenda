import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { ArrowLeft, AlertCircle } from "lucide-react-native";
import { styles } from "./styles";
import { useMyAppointments } from "./useMyAppointments";
import { AppointmentCard } from "./components/AppointmentCard";
import { colors } from "../../../theme/colors";

interface Props {
  onBack: () => void;
}

export function MyAppointments({ onBack }: Props) {
  const {
    loading,
    refreshing,
    activeTab,
    setActiveTab,
    filteredAppointments,
    onRefresh,
    handleCancel,
  } = useMyAppointments();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Meus Agendamentos</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ABAS (TABS) */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Agendados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            Histórico
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <AlertCircle size={48} color="#52525B" />
              <Text style={styles.emptyTitle}>
                {activeTab === "upcoming"
                  ? "Sem cortes agendados"
                  : "Histórico vazio"}
              </Text>
              <Text style={styles.emptySub}>
                {activeTab === "upcoming"
                  ? "Você não tem nenhum horário marcado para os próximos dias."
                  : "Seus agendamentos antigos aparecerão aqui."}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <AppointmentCard data={item} onCancel={handleCancel} />
          )}
        />
      )}
    </View>
  );
}
