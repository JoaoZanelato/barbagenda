import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../../../services/API";

export function useBarberAgenda() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadAgenda() {
    setRefreshing(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      // Busca agendamentos do dia inteiro (00:00 até 23:59)
      const response = await api.get(
        `/appointments?start_time=${today}T00:00:00&end_time=${today}T23:59:59`,
      );
      setAppointments(response.data);
    } catch (error) {
      console.log("Erro ao carregar agenda", error);
    } finally {
      setRefreshing(false);
    }
  }

  async function handleStatus(id: string, status: "completed" | "cancelled") {
    try {
      await api.patch(`/appointments/${id}`, { status });
      // Atualiza a lista após a mudança
      loadAgenda();
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar status do agendamento.");
    }
  }

  // Substituído useEffect por useFocusEffect para recarregar ao entrar na tela
  useFocusEffect(
    useCallback(() => {
      loadAgenda();
    }, []),
  );

  return {
    appointments,
    refreshing,
    loadAgenda,
    handleStatus,
  };
}
