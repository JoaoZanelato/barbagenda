import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  User,
  Scissors,
  XCircle,
  Clock,
  CheckCircle2,
} from "lucide-react-native";
import { styles } from "../styles";
import { Appointment } from "../types";

interface Props {
  data: Appointment;
  onCancel: (id: string) => void;
}

export function AppointmentCard({ data, onCancel }: Props) {
  // Normaliza o status
  const status = data.status ? data.status.toLowerCase() : "scheduled";

  const getStatusColor = () => {
    switch (status) {
      case "cancelled":
        return "#EF4444"; // Vermelho
      case "completed":
        return "#10B981"; // Verde (Atendido)
      default:
        return "#F59E0B"; // Amarelo (Agendado)
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "cancelled":
        return "Cancelado";
      case "completed":
        return "Atendido";
      default:
        return "Agendado";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "cancelled":
        return <XCircle size={14} color="#FFF" />;
      case "completed":
        return <CheckCircle2 size={14} color="#FFF" />;
      default:
        return <Clock size={14} color="#FFF" />;
    }
  };

  return (
    <View style={[styles.card, status === "cancelled" && styles.cardDimmed]}>
      <View style={styles.cardHeader}>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
        >
          {getStatusIcon()}
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
        <Text style={styles.price}>R$ {data.services?.price || "0,00"}</Text>
      </View>

      <Text style={styles.shopName}>{data.tenants?.name}</Text>
      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Calendar size={18} color="#A1A1AA" />
        <Text style={styles.infoText}>
          {/* Garante que a data é válida antes de formatar */}
          {data.start_time
            ? format(new Date(data.start_time), "EEEE, dd 'de' MMMM", {
                locale: ptBR,
              })
            : "Data inválida"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Clock size={18} color="#A1A1AA" />
        <Text style={styles.infoText}>
          {data.start_time
            ? format(new Date(data.start_time), "HH:mm", { locale: ptBR })
            : "--:--"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <User size={18} color="#A1A1AA" />
        <Text style={styles.infoText}>
          {data.users?.name || "Profissional"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Scissors size={18} color="#A1A1AA" />
        <Text style={styles.infoText}>{data.services?.name}</Text>
      </View>

      {status === "scheduled" && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => onCancel(data.id)}
        >
          <Text style={styles.cancelText}>Cancelar Agendamento</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
