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
    Alert.alert("Cancelar", "Deseja cancelar este horário?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        style: "destructive",
        onPress: async () => {
          try {
            await api.patch(`/mobile/appointments/${id}/cancel`);
            setAppointments((prev) =>
              prev.map((app) =>
                app.id === id ? { ...app, status: "cancelled" } : app,
              ),
            );
          } catch (error) {
            Alert.alert("Erro", "Falha ao cancelar.");
          }
        },
      },
    ]);
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    return appointments.filter((item) => {
      const appDate = new Date(item.start_time);
      const isPast = appDate < now;
      const status = item.status ? item.status.toLowerCase() : "scheduled";
      const isCancelled = status === "cancelled";

      if (activeTab === "upcoming") {
        return !isPast && !isCancelled;
      } else {
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
