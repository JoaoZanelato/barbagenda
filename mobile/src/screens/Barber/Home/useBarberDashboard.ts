import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { isSameDay, parseISO } from "date-fns";
import api from "../../../services/API";

// 👇 ATUALIZE A INTERFACE AQUI
export interface Appointment {
  id: string;
  start_time: string;
  end_time: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";

  // Novos campos mapeados pelo Backend
  client_name: string;
  client_avatar: string | null;
  client_phone: string;

  // Campos antigos (mantidos para compatibilidade do modal)
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

  const fetchData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);

      // Backend corrigido agora aceita chamada sem filtro de data (retorna tudo ou padrão)
      // Se quiser otimizar, pode passar start_time/end_time do dia aqui
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
    const interval = setInterval(() => fetchData(true), 10000);
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

  // ... (Mantenha as funções handleCreateService, handleDeleteService, etc. iguais)
  // Vou omitir aqui para economizar espaço, mas mantenha o código original dessas funções

  async function handleCreateService(
    name: string,
    price: string,
    duration: string,
  ) {
    /* ...código original... */
  }
  async function handleDeleteService(id: string) {
    /* ...código original... */
  }
  async function handleCreateProfessional(
    name: string,
    email: string,
    password: string,
  ) {
    /* ...código original... */
  }
  async function handleDeleteProfessional(id: string) {
    /* ...código original... */
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
