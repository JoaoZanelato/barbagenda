import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { isSameDay, parseISO } from "date-fns";
import api from "../../../services/API";

// --- Interfaces de Tipagem ---
export interface Appointment {
  id: string;
  start_time: string;
  end_time: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  customers?: { id: string; name: string; phone: string };
  services?: { id: string; name: string; price: string | number };
  users?: { name: string }; // Profissional responsável
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
  // --- Estados de Controle ---
  const [activeTab, setActiveTab] = useState<
    "agenda" | "services" | "metrics" | "team"
  >("agenda");
  const [loading, setLoading] = useState(true);

  // --- Estados de Dados ---
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  // --- Estados de Filtros e Modais ---
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalType, setModalType] = useState<
    "service" | "professional" | "appointment_details" | null
  >(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // --- Função Principal de Carregamento ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Carrega tudo em paralelo para ser rápido
      const [agendaRes, servicesRes, metricsRes, teamRes] = await Promise.all([
        api.get("/appointments"), // O ideal é filtrar por mês no backend
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
      setLoading(false);
    }
  }, []);

  // --- Lógica de Filtro de Data (Agenda) ---
  useEffect(() => {
    if (appointments.length > 0) {
      const filtered = appointments.filter((app) =>
        isSameDay(parseISO(app.start_time), selectedDate),
      );
      // Ordena por horário (Crescente)
      filtered.sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments([]);
    }
  }, [selectedDate, appointments]);

  // Carrega dados ao abrir a tela
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ============================================================
  // 🕹️ AÇÕES DE SERVIÇOS
  // ============================================================
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
        price: parseFloat(price.replace(",", ".")), // Garante formato numérico
        duration_minutes: parseInt(duration),
        description: "Serviço padrão",
      });

      Alert.alert("Sucesso", "Serviço criado!");
      setModalType(null);
      fetchData(); // Recarrega a lista
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar o serviço.");
    }
  }

  async function handleDeleteService(id: string) {
    Alert.alert("Excluir Serviço", "Tem certeza? Isso não pode ser desfeito.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/services/${id}`);
            fetchData();
          } catch (error) {
            Alert.alert(
              "Erro",
              "Falha ao excluir (Verifique se há agendamentos futuros).",
            );
          }
        },
      },
    ]);
  }

  // ============================================================
  // 👥 AÇÕES DE EQUIPE (PROFISSIONAIS)
  // ============================================================
  async function handleCreateProfessional(
    name: string,
    email: string,
    password: string,
  ) {
    if (!name || !email || !password)
      return Alert.alert("Atenção", "Preencha todos os campos.");

    try {
      await api.post("/professionals", { name, email, password });
      Alert.alert("Sucesso", "Profissional cadastrado na equipe!");
      setModalType(null);
      fetchData();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar o profissional.");
    }
  }

  async function handleDeleteProfessional(id: string) {
    Alert.alert("Remover da Equipe", "Este profissional perderá o acesso.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/professionals/${id}`);
            fetchData();
          } catch (error) {
            Alert.alert("Erro", "Falha ao remover profissional.");
          }
        },
      },
    ]);
  }

  // ============================================================
  // 📅 AÇÕES DE AGENDAMENTO (Confirmar/Cancelar)
  // ============================================================
  async function handleUpdateStatus(
    id: string,
    status: "COMPLETED" | "CANCELLED",
  ) {
    try {
      await api.patch(`/appointments/${id}`, { status });

      // Atualização Otimista (Atualiza a UI sem esperar o refresh total)
      const updatedList = appointments.map((app) =>
        app.id === id ? { ...app, status } : app,
      );
      setAppointments(updatedList);

      // Se estiver com o modal aberto, atualiza ele também
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment({ ...selectedAppointment, status });
      }

      Alert.alert(
        "Sucesso",
        `Agendamento ${status === "COMPLETED" ? "concluído" : "cancelado"}!`,
      );

      // Se cancelou, fecha o modal automaticamente para agilizar
      if (status === "CANCELLED") setModalType(null);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o status.");
    }
  }

  return {
    // Estados Visuais
    activeTab,
    setActiveTab,
    loading,

    // Dados Filtrados e Brutos
    appointments: filteredAppointments, // A View recebe a lista JÁ FILTRADA por data
    services,
    metrics,
    professionals,

    // Controles de Data e Modal
    selectedDate,
    setSelectedDate,
    modalType,
    setModalType,
    selectedAppointment,
    setSelectedAppointment,

    // Ações (Handlers)
    handleCreateService,
    handleDeleteService,
    handleCreateProfessional,
    handleDeleteProfessional,
    handleUpdateStatus,
    refresh: fetchData,
  };
}
