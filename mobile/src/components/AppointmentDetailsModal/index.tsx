import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
} from "react-native";
import {
  X,
  Phone,
  Clock,
  Calendar,
  Scissors,
  DollarSign,
  CheckCircle,
  Trash2,
} from "lucide-react-native";
import { styles } from "./styles";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  visible: boolean;
  appointment: any;
  onClose: () => void;
  onStatusChange: (id: string, status: "completed" | "cancelled") => void;
}

export function AppointmentDetailsModal({
  visible,
  appointment,
  onClose,
  onStatusChange,
}: Props) {
  if (!appointment) return null;

  // === TRATAMENTO DE DADOS ===
  // Garante que não quebra se vier nulo e busca os campos corretos
  const clientName =
    appointment.client_name ||
    appointment.app_client?.name ||
    "Cliente Desconhecido";
  const clientPhone =
    appointment.client_phone || appointment.app_client?.phone || "";
  const clientAvatar =
    appointment.client_avatar || appointment.app_client?.avatar_url;
  const serviceName = appointment.services?.name || "Serviço não informado";

  // Preço e Data
  const price = Number(
    appointment.total_price || appointment.services?.price || 0,
  ).toFixed(2);

  let dateStr = "--";
  let timeStr = "--";
  if (appointment.start_time) {
    try {
      const date = new Date(appointment.start_time);
      dateStr = format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
      timeStr = format(date, "HH:mm");
    } catch (e) {
      // Data inválida, mantém o fallback
    }
  }

  const handleCall = () => {
    if (clientPhone) Linking.openURL(`tel:${clientPhone}`);
  };

  const initial = clientName.charAt(0).toUpperCase();

  // Verifica se pode exibir os botões de ação
  const isScheduled =
    appointment.status === "scheduled" || appointment.status === "SCHEDULED";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* HEADER FIXO */}
          <View style={styles.header}>
            <Text style={styles.title}>Detalhes</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* CONTEÚDO COM SCROLL */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* 1. SEÇÃO CLIENTE */}
            <View style={styles.clientSection}>
              {clientAvatar ? (
                <Image
                  source={{ uri: clientAvatar }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarLetter}>{initial}</Text>
                </View>
              )}
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.clientName}>{clientName}</Text>
                {clientPhone ? (
                  <TouchableOpacity
                    onPress={handleCall}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
                    <Phone size={14} color="#D4AF37" />
                    <Text style={styles.clientPhone}>{clientPhone}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.clientPhone}>Sem telefone</Text>
                )}
              </View>
            </View>

            {/* 2. LISTA DE DADOS */}
            <View style={styles.infoContainer}>
              {/* Data */}
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Calendar size={20} color="#D4AF37" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Data</Text>
                  <Text style={styles.infoValue}>{dateStr}</Text>
                </View>
              </View>

              {/* Hora */}
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Clock size={20} color="#D4AF37" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Horário</Text>
                  <Text style={styles.infoValue}>{timeStr}</Text>
                </View>
              </View>

              {/* Serviço */}
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Scissors size={20} color="#D4AF37" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Serviço</Text>
                  <Text style={styles.infoValue}>{serviceName}</Text>
                </View>
              </View>

              {/* Valor */}
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <DollarSign size={20} color="#22C55E" />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Valor</Text>
                  <Text style={[styles.infoValue, { color: "#22C55E" }]}>
                    R$ {price}
                  </Text>
                </View>
              </View>
            </View>

            {/* 3. BOTÕES (Só aparecem se for agendado) */}
            {isScheduled ? (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => {
                    onStatusChange(appointment.id, "completed");
                    onClose();
                  }}
                >
                  <CheckCircle size={20} color="#FFF" />
                  <Text style={styles.completeText}>Concluir</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    onStatusChange(appointment.id, "cancelled");
                    onClose();
                  }}
                >
                  <Trash2 size={20} color="#FFF" />
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.statusBadge}>
                <Text style={{ color: "#A1A1AA" }}>
                  Status:{" "}
                  <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                    {appointment.status === "completed"
                      ? "Concluído"
                      : "Cancelado"}
                  </Text>
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
