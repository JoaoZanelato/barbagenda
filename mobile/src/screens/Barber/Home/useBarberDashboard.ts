import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { isSameDay, parseISO } from "date-fns";
import api from "../../../services/API";

// --- Interfaces mantidas iguais ---
export interface Appointment {
  id: string;
  start_time: string;
  end_time: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
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
  const [modalType, setModalType] = useState<
    "service" | "professional" | "appointment_details" | null
  >(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // 👇 MUDANÇA 1: Aceita 'isSilent' para não mostrar loading na atualização automática
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

  // 👇 MUDANÇA 2: Polling (Atualiza a cada 10 segundos)
  useEffect(() => {
    fetchData(); // Carga inicial

    const interval = setInterval(() => {
      fetchData(true); // Atualização silenciosa
    }, 10000);

    return () => clearInterval(interval); // Limpa ao sair da tela
  }, [fetchData]);

  // --- Filtro de Data ---
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

  // --- Ações (Handlers) Mantidos Iguais ---
  async function handleCreateService(
    name: string,
    price: string,
    duration: string,
  ) {
    if (!name || !price || !duration)
      return Alert.alert("Atenção", "Preencha todos os campos.");
    try {
      await api.post("/services", {
        name,
        price: parseFloat(price.replace(",", ".")),
        duration_minutes: parseInt(duration),
        description: "Serviço padrão",
      });
      Alert.alert("Sucesso", "Serviço criado!");
      setModalType(null);
      fetchData();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o serviço.");
    }
  }

  async function handleDeleteService(id: string) {
    Alert.alert("Excluir Serviço", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/services/${id}`);
            fetchData();
          } catch (error) {
            Alert.alert("Erro", "Falha ao excluir.");
          }
        },
      },
    ]);
  }

  async function handleCreateProfessional(
    name: string,
    email: string,
    password: string,
  ) {
    if (!name || !email || !password)
      return Alert.alert("Atenção", "Preencha todos os campos.");
    try {
      await api.post("/professionals", { name, email, password });
      Alert.alert("Sucesso", "Profissional cadastrado!");
      setModalType(null);
      fetchData();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar.");
    }
  }

  async function handleDeleteProfessional(id: string) {
    Alert.alert("Remover da Equipe", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/professionals/${id}`);
            fetchData();
          } catch (error) {
            Alert.alert("Erro", "Falha ao remover.");
          }
        },
      },
    ]);
  }

  async function handleUpdateStatus(
    id: string,
    status: "COMPLETED" | "CANCELLED",
  ) {
    try {
      await api.patch(`/appointments/${id}`, { status });
      const updatedList = appointments.map((app) =>
        app.id === id ? { ...app, status } : app,
      );
      setAppointments(updatedList);
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment({ ...selectedAppointment, status });
      }
      Alert.alert(
        "Sucesso",
        `Agendamento ${status === "COMPLETED" ? "concluído" : "cancelado"}!`,
      );
      if (status === "CANCELLED") setModalType(null);
    } catch (error) {
      console.error(error);
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
