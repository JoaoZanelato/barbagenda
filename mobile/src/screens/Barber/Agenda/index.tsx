import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { format } from "date-fns";
import {
  Clock,
  Trash2,
  CheckCircle,
  DollarSign,
  Calendar as CalendarIcon,
} from "lucide-react-native";
import { styles } from "./styles";
import { useBarberAgenda } from "./useBarberAgenda";
import { AppointmentDetailsModal } from "../../../components/AppointmentDetailsModal";
import { colors } from "../../../theme/colors";

export function BarberAgenda() {
  const { appointments, refreshing, loadAgenda, handleStatus } =
    useBarberAgenda();

  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenDetails = (appointment: any) => {
    // Passa o objeto COMPLETO para o modal
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => {
    // Fallback seguro para exibição no card
    const clientName = item.client_name || item.app_client?.name || "Cliente";
    const initial = clientName.charAt(0).toUpperCase();
    const avatarUrl = item.client_avatar || item.app_client?.avatar_url;

    // Status e Cores
    const isCompleted =
      item.status === "completed" || item.status === "COMPLETED";
    const isCancelled =
      item.status === "cancelled" || item.status === "CANCELLED";
    const statusColor = isCompleted
      ? "#22C55E"
      : isCancelled
        ? "#EF4444"
        : "#EAB308";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleOpenDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarLetter}>{initial}</Text>
              </View>
            )}
            <View>
              <Text style={styles.clientName}>{clientName}</Text>
              <Text style={styles.serviceText}>
                {item.services?.name || "Serviço não informado"}
              </Text>
            </View>
          </View>

          <View
            style={[styles.timeBadge, { backgroundColor: statusColor + "20" }]}
          >
            <Clock size={14} color={statusColor} />
            <Text style={[styles.timeText, { color: statusColor }]}>
              {item.start_time
                ? format(new Date(item.start_time), "HH:mm")
                : "--:--"}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 12,
            alignItems: "center",
            gap: 6,
          }}
        >
          <DollarSign size={14} color="#22C55E" />
          <Text style={{ color: "#22C55E", fontWeight: "bold" }}>
            R$ {item.total_price || item.services?.price || "0.00"}
          </Text>
        </View>

        {/* Botões rápidos (somente se agendado) */}
        {!isCompleted && !isCancelled && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={() => handleStatus(item.id, "cancelled")}
              style={styles.cancelButton}
            >
              <Trash2 size={16} color="#EF4444" />
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleStatus(item.id, "completed")}
              style={styles.completeButton}
            >
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.completeText}>Concluir</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda de Hoje</Text>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={loadAgenda}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <CalendarIcon size={48} color="#3F3F46" />
            <Text style={styles.emptyText}>Nenhum agendamento hoje.</Text>
          </View>
        }
        renderItem={renderItem}
      />

      <AppointmentDetailsModal
        visible={modalVisible}
        appointment={selectedAppointment}
        onClose={() => setModalVisible(false)}
        onStatusChange={(id, status) => {
          handleStatus(id, status);
          setModalVisible(false);
        }}
      />
    </View>
  );
}
