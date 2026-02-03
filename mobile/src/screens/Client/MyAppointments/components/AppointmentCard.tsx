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
  // Normaliza o status para evitar erros com "SCHEDULED" (Maiúsculo) vindo do Banco
  const status = data.status ? data.status.toLowerCase() : "scheduled";

  // 1. Definição das Cores
  const getStatusColor = () => {
    switch (status) {
      case "cancelled":
        return "#EF4444"; // Vermelho
      case "completed":
        return "#10B981"; // Verde
      case "scheduled":
      default:
        return "#F59E0B"; // Amarelo
    }
  };

  // 2. Tradução dos Textos
  const getStatusText = () => {
    switch (status) {
      case "cancelled":
        return "Cancelado";
      case "completed":
        return "Atendido"; // Pedido: "Atendido" em vez de Concluído
      case "scheduled":
      default:
        return "Agendado";
    }
  };

  // 3. Ícone correspondente
  const getStatusIcon = () => {
    switch (status) {
      case "cancelled":
        return <XCircle size={14} color="#FFF" />;
      case "completed":
        return <CheckCircle2 size={14} color="#FFF" />;
      case "scheduled":
      default:
        return <Clock size={14} color="#FFF" />;
    }
  };

  return (
    <View style={[styles.card, status === "cancelled" && styles.cardDimmed]}>
      {/* Cabeçalho do Card */}
      <View style={styles.cardHeader}>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
        >
          {getStatusIcon()}
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
        <Text style={styles.price}>R$ {data.services?.price}</Text>
      </View>

      {/* Título da Barbearia */}
      <Text style={styles.shopName}>{data.tenants?.name}</Text>

      <View style={styles.divider} />

      {/* Informações */}
      <View style={styles.infoRow}>
        <Calendar size={18} color="#A1A1AA" />
        <Text style={styles.infoText}>
          {format(new Date(data.start_time), "EEEE, dd 'de' MMMM", {
            locale: ptBR,
          })}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Clock size={18} color="#A1A1AA" />
        <Text style={styles.infoText}>
          {format(new Date(data.start_time), "HH:mm", { locale: ptBR })}
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

      {/* Botão de Cancelar (Apenas se estiver Agendado) */}
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
