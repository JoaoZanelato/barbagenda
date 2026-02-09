import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { isSameDay, parseISO } from "date-fns";
import api from "../../../services/API";

export interface Appointment {
  id: string;
  start_time: string;
  end_time: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  client_name: string;
  client_avatar: string | null;
  client_phone: string;
  customers?: { id: string; name: string; phone: string };
  services?: { id: string; name: string; price: string | number };
  users?: { name: string };
}

export interface Service {
  id: string;
  name: string;
  price: string | number;
  duration_minutes: number;
}

export interface Professional {
  id: string;
  name: string;
  email: string;
}

export interface DashboardMetrics {
  appointmentsToday: number;
  revenueToday: string;
  appointmentsMonth: number;
}

export function useBarberDashboard() {
  const [activeTab, setActiveTab] = useState<
    "agenda" | "services" | "metrics" | "team"
  >("agenda");
  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  const [selectedDate, setSelectedDate] = useState(new Date());

  // Estado unificado de Modais
  const [modalType, setModalType] = useState<
    "service" | "professional" | "appointment_details" | null
  >(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const fetchData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);

      const [agendaRes, servicesRes, metricsRes, teamRes] = await Promise.all([
        api.get("/appointments"),
        api.get("/services"),
        api.get("/dashboard/metrics"),
        api.get("/professionals"),
      ]);

      setAppointments(agendaRes.data);
      setServices(servicesRes.data);
      setMetrics(metricsRes.data);
      setProfessionals(teamRes.data);
    } catch (error) {
      console.log("Erro ao carregar dashboard:", error);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Refresh automático a cada 30s para não sobrecarregar
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Filtro de Data
  useEffect(() => {
    if (appointments.length > 0) {
      const filtered = appointments.filter((app) =>
        isSameDay(parseISO(app.start_time), selectedDate),
      );
      filtered.sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments([]);
    }
  }, [selectedDate, appointments]);

  // === LÓGICA DE SERVIÇOS ===
  async function handleCreateService(
    name: string,
    price: string,
    duration: string,
  ) {
    if (!name || !price || !duration)
      return Alert.alert("Erro", "Preencha todos os campos.");
    try {
      await api.post("/services", {
        name,
        price: Number(price),
        duration_minutes: Number(duration),
      });
      Alert.alert("Sucesso", "Serviço criado!");
      setModalType(null);
      fetchData(true);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o serviço.");
    }
  }

  async function handleDeleteService(id: string) {
    Alert.alert("Confirmar", "Deseja excluir este serviço?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/services/${id}`);
            setServices((prev) => prev.filter((s) => s.id !== id));
          } catch {
            Alert.alert("Erro", "Falha ao excluir.");
          }
        },
      },
    ]);
  }

  // === LÓGICA DE PROFISSIONAIS ===
  async function handleCreateProfessional(
    name: string,
    email: string,
    password: string,
  ) {
    if (!name || !email || !password)
      return Alert.alert("Erro", "Preencha todos os campos.");
    try {
      await api.post("/professionals", { name, email, password });
      Alert.alert("Sucesso", "Profissional adicionado!");
      setModalType(null);
      fetchData(true);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o profissional.");
    }
  }

  async function handleDeleteProfessional(id: string) {
    Alert.alert("Confirmar", "Remover este profissional?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/professionals/${id}`);
            setProfessionals((prev) => prev.filter((p) => p.id !== id));
          } catch {
            Alert.alert("Erro", "Falha ao remover.");
          }
        },
      },
    ]);
  }

  // === ATUALIZAR STATUS ===
  async function handleUpdateStatus(
    id: string,
    status: "COMPLETED" | "CANCELLED",
  ) {
    try {
      await api.patch(`/appointments/${id}`, { status });

      // Atualiza localmente para feedback instantâneo
      const updatedList = appointments.map((app) =>
        app.id === id ? { ...app, status } : app,
      );
      setAppointments(updatedList);

      Alert.alert(
        "Sucesso",
        `Agendamento ${status === "COMPLETED" ? "concluído" : "cancelado"}!`,
      );
      if (status === "CANCELLED") setModalType(null);

      fetchData(true); // Garante sincronia
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o status.");
    }
  }

  return {
    activeTab,
    setActiveTab,
    loading,
    appointments: filteredAppointments,
    services,
    metrics,
    professionals,
    selectedDate,
    setSelectedDate,
    modalType,
    setModalType,
    selectedAppointment,
    setSelectedAppointment,
    handleCreateService,
    handleDeleteService,
    handleCreateProfessional,
    handleDeleteProfessional,
    handleUpdateStatus,
    refresh: () => fetchData(false),
  };
}
