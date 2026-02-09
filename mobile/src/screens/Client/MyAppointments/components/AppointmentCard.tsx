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
  const status = data.status ? data.status.toLowerCase() : "scheduled";

  const getStatusColor = () => {
    switch (status) {
      case "cancelled":
        return "#EF4444";
      case "completed":
        return "#10B981";
      default:
        return "#F59E0B";
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

  return (
    <View style={[styles.card, status === "cancelled" && styles.cardDimmed]}>
      <View style={styles.cardHeader}>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
        >
          <Clock size={14} color="#FFF" />
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
        <Text style={styles.price}>R$ {data.services?.price || "0,00"}</Text>
      </View>

      <Text style={[styles.shopName, { color: "#FFF" }]}>
        {data.tenants?.name}
      </Text>
      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Calendar size={18} color="#A1A1AA" />
        <Text style={[styles.infoText, { color: "#E4E4E7" }]}>
          {data.start_time
            ? format(new Date(data.start_time), "EEEE, dd 'de' MMMM", {
                locale: ptBR,
              })
            : "Data inválida"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Clock size={18} color="#A1A1AA" />
        <Text style={[styles.infoText, { color: "#E4E4E7" }]}>
          {data.start_time
            ? format(new Date(data.start_time), "HH:mm")
            : "--:--"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <User size={18} color="#A1A1AA" />
        <Text style={[styles.infoText, { color: "#E4E4E7" }]}>
          {data.users?.name || "Profissional"}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Scissors size={18} color="#A1A1AA" />
        <Text style={[styles.infoText, { color: "#E4E4E7" }]}>
          {data.services?.name || "Serviço"}
        </Text>
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
