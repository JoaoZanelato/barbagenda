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

  // === TRATAMENTO DE DADOS (Compatível com AppointmentController) ===
  const clientName = appointment.client_name || "Cliente";
  const clientPhone = appointment.client_phone || "";
  const clientAvatar = appointment.client_avatar;

  // O backend envia 'services' como objeto (relação Prisma)
  const serviceName = appointment.services?.name || "Serviço não informado";

  // Preço total ou preço do serviço
  const priceRaw = appointment.total_price || appointment.services?.price || 0;
  const price = Number(priceRaw).toFixed(2);

  // Formatação de Data/Hora
  const dateStr = appointment.start_time
    ? format(new Date(appointment.start_time), "EEEE, dd 'de' MMMM", {
        locale: ptBR,
      })
    : "--";

  const timeStr = appointment.start_time
    ? format(new Date(appointment.start_time), "HH:mm")
    : "--:--";

  const handleCall = () => {
    if (clientPhone) Linking.openURL(`tel:${clientPhone}`);
  };

  const initial = clientName.charAt(0).toUpperCase();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.title}>Detalhes do Agendamento</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Cartão do Cliente */}
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
              <View style={{ flex: 1 }}>
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
                  <Text style={[styles.clientPhone, { color: "#52525B" }]}>
                    Sem telefone
                  </Text>
                )}
              </View>
            </View>

            {/* Informações */}
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Calendar size={20} color="#D4AF37" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Data</Text>
                  <Text style={styles.infoValue}>{dateStr}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Clock size={20} color="#D4AF37" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Horário</Text>
                  <Text style={styles.infoValue}>{timeStr}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <Scissors size={20} color="#D4AF37" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Serviço</Text>
                  <Text style={styles.infoValue}>{serviceName}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.iconBox}>
                  <DollarSign size={20} color="#22C55E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Valor Total</Text>
                  <Text style={[styles.infoValue, { color: "#22C55E" }]}>
                    R$ {price}
                  </Text>
                </View>
              </View>
            </View>

            {/* Botões de Ação (Apenas se Agendado) */}
            {appointment.status === "scheduled" ||
            appointment.status === "SCHEDULED" ? (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => {
                    onStatusChange(appointment.id, "completed");
                    onClose();
                  }}
                >
                  <CheckCircle size={20} color="#FFF" />
                  <Text style={styles.completeText}>Concluir Atendimento</Text>
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
              <Text style={styles.statusMessage}>
                Agendamento{" "}
                {appointment.status === "completed" ? "Concluído" : "Cancelado"}
                .
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
