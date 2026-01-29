import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LogOut, Calendar, Scissors, TrendingUp } from "lucide-react-native";
import { format } from "date-fns";
import { styles } from "./styles";
import { useBarberDashboard } from "./useBarberDashboard";
import { colors } from "../../../theme/colors";

export function BarberDashboard({ onLogout }: { onLogout: () => void }) {
  const { activeTab, setActiveTab, appointments, services, metrics, loading } =
    useBarberDashboard();

  const renderTab = (
    key: "agenda" | "services" | "metrics",
    label: string,
    Icon: any,
  ) => (
    <TouchableOpacity
      onPress={() => setActiveTab(key)}
      style={[styles.tab, activeTab === key && styles.activeTab]}
    >
      <Icon
        size={20}
        color={activeTab === key ? colors.black : colors.textSecondary}
      />
      <Text style={activeTab === key ? styles.activeTabText : styles.tabText}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Painel Barbeiro</Text>
        <TouchableOpacity onPress={onLogout}>
          <LogOut size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* Navegação */}
      <View style={styles.tabs}>
        {renderTab("agenda", "Agenda", Calendar)}
        {renderTab("services", "Serviços", Scissors)}
        {renderTab("metrics", "Métricas", TrendingUp)}
      </View>

      {/* Conteúdo */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <View style={{ flex: 1 }}>
          {/* AGENDA */}
          {activeTab === "agenda" && (
            <FlatList
              data={appointments}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhum agendamento.</Text>
              }
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.timeBox}>
                    <Text style={styles.timeText}>
                      {format(new Date(item.start_time), "HH:mm")}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>
                      {item.customers?.name || "Cliente"}
                    </Text>
                    <Text style={styles.cardDesc}>
                      {item.services?.name} -{" "}
                      {format(new Date(item.start_time), "dd/MM")}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}

          {/* SERVIÇOS */}
          {activeTab === "services" && (
            <FlatList
              data={services}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Scissors size={24} color={colors.primary} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardDesc}>
                      {item.duration_minutes} min
                    </Text>
                  </View>
                  <Text style={styles.priceText}>R$ {item.price}</Text>
                </View>
              )}
            />
          )}

          {/* MÉTRICAS */}
          {activeTab === "metrics" && metrics && (
            <ScrollView contentContainerStyle={styles.metricsContainer}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Agendamentos Hoje</Text>
                <Text style={styles.metricValue}>
                  {metrics.appointmentsToday || 0}
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Faturamento Hoje</Text>
                <Text style={styles.metricValue}>
                  R$ {metrics.revenueToday || "0.00"}
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Total Mensal</Text>
                <Text style={styles.metricValue}>
                  {metrics.appointmentsMonth || 0}
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}
