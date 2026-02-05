import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import {
  LogOut,
  Calendar as CalendarIcon,
  Scissors,
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
import { useBarberDashboard } from "./useBarberDashboard"; // 👈 Hook Correto
import { colors } from "../../../theme/colors";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { useAuth } from "../../../context/AuthContext";

export function BarberDashboard() {
  const { signOut } = useAuth();

  const {
    activeTab,
    setActiveTab,
    appointments,
    services,
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

  const getStatusColor = (status: string) => {
    if (status === "COMPLETED") return colors.success;
    if (status === "CANCELLED") return colors.error;
    return colors.primary;
  };

  const getStatusLabel = (status: string) => {
    if (status === "COMPLETED") return "Concluído";
    if (status === "CANCELLED") return "Cancelado";
    return "Agendado";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Painel Gerencial</Text>
        <TouchableOpacity onPress={signOut}>
          <LogOut size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {renderTab("agenda", "Agenda", CalendarIcon)}
        {renderTab("services", "Serviços", Scissors)}
        {renderTab("team", "Equipe", Users)}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 40 }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          {/* === AGENDA === */}
          {activeTab === "agenda" && (
            <>
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

              <FlatList
                data={appointments}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    Agenda livre para este dia.
                  </Text>
                }
                contentContainerStyle={{ paddingBottom: 80 }}
                renderItem={({ item }) => {
                  const statusColor = getStatusColor(item.status);
                  return (
                    <TouchableOpacity
                      style={[
                        styles.card,
                        { borderLeftWidth: 4, borderLeftColor: statusColor },
                        item.status === "CANCELLED" && { opacity: 0.6 },
                      ]}
                      onPress={() => openAppointmentDetails(item)}
                    >
                      {item.client_avatar ? (
                        <Image
                          source={{ uri: item.client_avatar }}
                          style={styles.avatar}
                        />
                      ) : (
                        <View style={styles.avatarPlaceholder}>
                          <Text style={styles.avatarLetter}>
                            {item.client_name ? item.client_name[0] : "C"}
                          </Text>
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{item.client_name}</Text>
                        <Text style={styles.cardDesc}>
                          {item.services?.name}
                        </Text>
                        <View
                          style={{
                            marginTop: 4,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 4,
                            alignSelf: "flex-start",
                            backgroundColor:
                              item.status === "COMPLETED"
                                ? "rgba(16,185,129,0.1)"
                                : item.status === "CANCELLED"
                                  ? "rgba(239,68,68,0.1)"
                                  : "rgba(212,175,55,0.1)",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "bold",
                              color: statusColor,
                            }}
                          >
                            {getStatusLabel(item.status)}
                          </Text>
                        </View>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Clock
                          size={14}
                          color={colors.textSecondary}
                          style={{ marginBottom: 4 }}
                        />
                        <Text style={styles.timeText}>
                          {format(new Date(item.start_time), "HH:mm")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </>
          )}

          {/* === SERVIÇOS === */}
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
                  <View
                    style={[
                      styles.card,
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: "rgba(212, 175, 55, 0.1)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Scissors size={20} color={colors.primary} />
                      </View>
                      <View>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.cardDesc}>
                          {item.duration_minutes} min • R${" "}
                          {Number(item.price).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteService(item.id)}
                      style={{ padding: 8 }}
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

          {/* === EQUIPE === */}
          {activeTab === "team" && (
            <>
              <FlatList
                data={professionals}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 80 }}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    Nenhum profissional extra.
                  </Text>
                }
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: "#27272A",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <User size={20} color={colors.primary} />
                      </View>
                      <View>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.cardDesc}>{item.email}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteProfessional(item.id)}
                      style={{ position: "absolute", right: 16, top: 16 }}
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
        </View>
      )}

      {/* MODAIS (Código resumido, mantenha os que já existiam) */}
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
                {/* ... Detalhes ... */}
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
            {/* ... Inputs ... */}
            {modalType === "service" ? (
              <Button
                title="Criar"
                onPress={() =>
                  handleCreateService(newName, newPrice, newDuration)
                }
              />
            ) : (
              <Button
                title="Criar"
                onPress={() =>
                  handleCreateProfessional(newName, newEmail, newPassword)
                }
              />
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
