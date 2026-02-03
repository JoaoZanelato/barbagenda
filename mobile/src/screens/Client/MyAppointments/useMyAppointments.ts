import { useState, useCallback, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import api from "../../../services/API";
import { Appointment } from "./types";

export function useMyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );

  async function fetchAppointments() {
    try {
      const response = await api.get("/mobile/my-appointments");
      console.log("📦 Agendamentos atualizados:", response.data.length);
      setAppointments(response.data);
    } catch (error) {
      console.log("Erro ao buscar agendamentos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, []);

  async function handleCancel(id: string) {
    Alert.alert("Cancelar Horário", "Tem certeza que deseja cancelar?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim, cancelar",
        style: "destructive",
        onPress: async () => {
          try {
            await api.patch(`/mobile/appointments/${id}/cancel`);
            // Atualização otimista
            setAppointments((prev) =>
              prev.map((app) =>
                app.id === id ? { ...app, status: "cancelled" } : app,
              ),
            );
          } catch (error) {
            Alert.alert("Erro", "Não foi possível cancelar.");
          }
        },
      },
    ]);
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 👇 LÓGICA DE FILTRO CORRIGIDA (BASEADA EM DATA)
  const filteredAppointments = useMemo(() => {
    const now = new Date(); // Data e hora exata de agora

    return appointments.filter((item) => {
      const appointmentDate = new Date(item.start_time);
      const isPast = appointmentDate < now; // É passado?

      const status = item.status ? item.status.toLowerCase() : "scheduled";
      const isCancelled = status === "cancelled";

      if (activeTab === "upcoming") {
        // Agendados = Futuro E Ativo (Não cancelado)
        return !isPast && !isCancelled;
      } else {
        // Histórico = Passado (Mesmo se esquecerem de finalizar) OU Cancelado
        return isPast || isCancelled;
      }
    });
  }, [appointments, activeTab]);

  return {
    loading,
    refreshing,
    activeTab,
    setActiveTab,
    filteredAppointments,
    onRefresh,
    handleCancel,
  };
}
