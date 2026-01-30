import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import {
  LogOut,
  Calendar as CalendarIcon,
  Scissors,
  TrendingUp,
  Users,
  Plus,
  Trash2,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
} from "lucide-react-native";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

import { styles } from "./styles";
import { useBarberDashboard } from "./useBarberDashboard";
import { colors } from "../../../theme/colors";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { useNotifications } from "../../../hooks/useNotifications"; // 👈 Importe

export function BarberDashboard({ onLogout }: { onLogout: () => void }) {
  // 👇 Ativa Notificações (Barbeiro = true)
  useNotifications(true);

  // Hook com toda a lógica de negócio
  const {
    activeTab,
    setActiveTab,
    appointments,
    services,
    metrics,
    professionals,
    loading,
    modalType,
    setModalType,
    selectedDate,
    setSelectedDate,
    selectedAppointment,
    setSelectedAppointment,
    handleCreateService,
    handleDeleteService,
    handleCreateProfessional,
    handleDeleteProfessional,
    handleUpdateStatus,
  } = useBarberDashboard();

  // Estados locais
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const openCreationModal = (type: "service" | "professional") => {
    setNewName("");
    setNewPrice("");
    setNewDuration("");
    setNewEmail("");
    setNewPassword("");
    setModalType(type);
  };

  const openAppointmentDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setModalType("appointment_details");
  };

  const renderTab = (key: any, label: string, Icon: any) => (
    <TouchableOpacity
      onPress={() => setActiveTab(key)}
      style={[styles.tab, activeTab === key && styles.activeTab]}
    >
      <Icon
        size={20}
        color={activeTab === key ? colors.background : colors.textSecondary}
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
        <Text style={styles.headerTitle}>Painel Gerencial</Text>
        <TouchableOpacity onPress={onLogout}>
          <LogOut size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* Navegação (Tabs) */}
      <View style={styles.tabs}>
        {renderTab("agenda", "Agenda", CalendarIcon)}
        {renderTab("services", "Serviços", Scissors)}
        {renderTab("team", "Equipe", Users)}
        {renderTab("metrics", "Métricas", TrendingUp)}
      </View>

      {/* Conteúdo Principal */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 40 }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          {/* ==================== ABA AGENDA ==================== */}
          {activeTab === "agenda" && (
            <>
              {/* Filtro de Data */}
              <View style={styles.dateFilter}>
                <TouchableOpacity
                  onPress={() => setSelectedDate(subDays(selectedDate, 1))}
                >
                  <ChevronLeft size={24} color={colors.primary} />
                </TouchableOpacity>
                <View style={{ alignItems: "center" }}>
                  <Text style={styles.dateText}>
                    {format(selectedDate, "EEEE, d 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </Text>
                  <Text style={styles.dateSubText}>
                    {appointments.length} agendamentos
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedDate(addDays(selectedDate, 1))}
                >
                  <ChevronRight size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Lista de Agendamentos */}
              <FlatList
                data={appointments}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    Agenda livre para este dia.
                  </Text>
                }
                contentContainerStyle={{ paddingBottom: 80 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.card,
                      item.status === "CANCELLED" && {
                        opacity: 0.6,
                        borderColor: colors.error,
                      },
                    ]}
                    onPress={() => openAppointmentDetails(item)}
                  >
                    <View style={styles.timeBox}>
                      <Text style={styles.timeText}>
                        {format(new Date(item.start_time), "HH:mm")}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>
                        {item.customers?.name || "Cliente sem nome"}
                      </Text>
                      <Text style={styles.cardDesc}>{item.services?.name}</Text>
                      <Text
                        style={[
                          styles.statusBadge,
                          item.status === "COMPLETED"
                            ? { color: colors.success }
                            : item.status === "CANCELLED"
                              ? { color: colors.error }
                              : { color: colors.primary },
                        ]}
                      >
                        {item.status === "SCHEDULED"
                          ? "Agendado"
                          : item.status === "COMPLETED"
                            ? "Concluído"
                            : "Cancelado"}
                      </Text>
                    </View>
                    <ChevronRight size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              />
            </>
          )}

          {/* ==================== ABA SERVIÇOS ==================== */}
          {activeTab === "services" && (
            <>
              <FlatList
                data={services}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 80 }}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    Nenhum serviço cadastrado.
                  </Text>
                }
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Scissors size={24} color={colors.primary} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardDesc}>
                        {item.duration_minutes} min • R${" "}
                        {Number(item.price).toFixed(2)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteService(item.id)}
                    >
                      <Trash2 size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                )}
              />
              <TouchableOpacity
                style={styles.fab}
                onPress={() => openCreationModal("service")}
              >
                <Plus size={24} color={colors.background} />
              </TouchableOpacity>
            </>
          )}

          {/* ==================== ABA EQUIPE ==================== */}
          {activeTab === "team" && (
            <>
              <FlatList
                data={professionals}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 80 }}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    Nenhum profissional além de você.
                  </Text>
                }
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <Users size={24} color={colors.primary} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardDesc}>{item.email}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteProfessional(item.id)}
                    >
                      <Trash2 size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                )}
              />
              <TouchableOpacity
                style={styles.fab}
                onPress={() => openCreationModal("professional")}
              >
                <Plus size={24} color={colors.background} />
              </TouchableOpacity>
            </>
          )}

          {/* ==================== ABA MÉTRICAS ==================== */}
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

      {/* Modais omitidos para brevidade (permanecem iguais) */}
      <Modal
        visible={modalType === "appointment_details"}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedAppointment && (
              <>
                <Text style={styles.modalTitle}>Detalhes do Agendamento</Text>

                <View style={styles.detailRow}>
                  <User size={20} color={colors.primary} />
                  <Text style={styles.detailText}>
                    {selectedAppointment.customers?.name || "Cliente"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Phone size={20} color={colors.primary} />
                  <Text style={styles.detailText}>
                    {selectedAppointment.customers?.phone || "Sem telefone"}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <Scissors size={20} color={colors.primary} />
                  <Text style={styles.detailText}>
                    {selectedAppointment.services?.name || "Serviço"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock size={20} color={colors.primary} />
                  <Text style={styles.detailText}>
                    {format(
                      new Date(selectedAppointment.start_time),
                      "dd/MM 'às' HH:mm",
                    )}
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  {selectedAppointment.status !== "COMPLETED" &&
                    selectedAppointment.status !== "CANCELLED" && (
                      <Button
                        title="Confirmar Atendimento"
                        onPress={() =>
                          handleUpdateStatus(
                            selectedAppointment.id,
                            "COMPLETED",
                          )
                        }
                        style={{
                          backgroundColor: colors.success,
                          marginBottom: 12,
                        }}
                      />
                    )}

                  {selectedAppointment.status !== "CANCELLED" && (
                    <Button
                      title="Cancelar Agendamento"
                      onPress={() =>
                        handleUpdateStatus(selectedAppointment.id, "CANCELLED")
                      }
                      style={{ backgroundColor: colors.error }}
                    />
                  )}
                </View>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setModalType(null)}
                >
                  <Text style={styles.closeText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalType === "service" || modalType === "professional"}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === "service" ? "Novo Serviço" : "Novo Profissional"}
            </Text>

            {modalType === "service" ? (
              <>
                <Input
                  placeholder="Nome do Serviço"
                  value={newName}
                  onChangeText={setNewName}
                />
                <Input
                  placeholder="Preço (ex: 35.00)"
                  keyboardType="numeric"
                  value={newPrice}
                  onChangeText={setNewPrice}
                />
                <Input
                  placeholder="Duração (minutos)"
                  keyboardType="numeric"
                  value={newDuration}
                  onChangeText={setNewDuration}
                />
                <Button
                  title="Salvar Serviço"
                  onPress={() =>
                    handleCreateService(newName, newPrice, newDuration)
                  }
                />
              </>
            ) : (
              <>
                <Input
                  placeholder="Nome Completo"
                  value={newName}
                  onChangeText={setNewName}
                />
                <Input
                  placeholder="E-mail de Acesso"
                  keyboardType="email-address"
                  value={newEmail}
                  onChangeText={setNewEmail}
                />
                <Input
                  placeholder="Senha Provisória"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <Button
                  title="Cadastrar Profissional"
                  onPress={() =>
                    handleCreateProfessional(newName, newEmail, newPassword)
                  }
                />
              </>
            )}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalType(null)}
            >
              <Text style={styles.closeText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
