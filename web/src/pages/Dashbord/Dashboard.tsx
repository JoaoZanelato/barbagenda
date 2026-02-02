import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  DollarSign,
  CalendarDays,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Header } from "../../components/layout/Header";
import { Card, CardContent, CardHeader } from "../../components/ui/Card/Card";
import { Button } from "../../components/ui/Button/Button";
import { Modal } from "../../components/ui/Modal/Modal";
import { Input } from "../../components/ui/Input/Input";

import styles from "./Dashboard.module.css";
import { cn } from "../../lib/utils";

// --- TIPOS ---
interface Metrics {
  todayCount: number;
  estimatedIncome: number;
  confirmedIncome: number;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Appointment {
  id: string;
  customer_phone: string;
  start_time: string;
  status: "confirmed" | "completed" | "canceled";
  services: { name: string; price: string };
  users: { name: string };
}

export function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "appointments">(
    "overview",
  );

  // --- DADOS ---
  const [metrics, setMetrics] = useState<Metrics>({
    todayCount: 0,
    estimatedIncome: 0,
    confirmedIncome: 0,
  });
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // --- MODAIS ---
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isProfessionalModalOpen, setIsProfessionalModalOpen] = useState(false);
  const [isManualScheduleModalOpen, setIsManualScheduleModalOpen] =
    useState(false);

  // --- FORMS ---
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
  });
  const [newProfessional, setNewProfessional] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  // Form de Agendamento Manual
  const [manualSchedule, setManualSchedule] = useState({
    customerPhone: "",
    serviceId: "",
    professionalId: "",
    date: "",
    time: "",
  });

  // --- CARREGAR DADOS ---
  async function loadData() {
    try {
      const timestamp = new Date().getTime();
      const [resServices, resMetrics, resPros, resAppt] = await Promise.all([
        api.get(`/services?t=${timestamp}`),
        api.get(`/dashboard/metrics?t=${timestamp}`),
        api.get(`/professionals?t=${timestamp}`),
        api.get(`/appointments?t=${timestamp}`),
      ]);

      setServices(resServices.data);
      setMetrics(resMetrics.data);
      setProfessionals(resPros.data);
      setAppointments(resAppt.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- AÇÕES DE CRIAÇÃO ---
  async function handleCreateService(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/services", {
        name: newService.name,
        price: Number(newService.price),
        duration: Number(newService.duration),
        description: newService.description,
      });
      setIsServiceModalOpen(false);
      setNewService({ name: "", price: "", duration: "", description: "" });
      loadData();
    } catch (error) {
      alert("Erro ao criar serviço");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateProfessional(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    async function handleManualScheduleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setIsLoading(true);

      try {
        // Formata a data para ISO string, que é o que o backend espera
        const startDateTime = new Date(
          `${manualSchedule.date}T${manualSchedule.time}:00`,
        ).toISOString();

        // 👇 AQUI ESTAVA O ERRO: Os nomes dos campos devem bater com o Controller
        await api.post("/appointments", {
          professionalId: manualSchedule.professionalId, // Antes: user_id
          startTime: startDateTime, // Antes: start_time
          services: [{ id: manualSchedule.serviceId }], // Antes: service_id (agora é array)

          // Enviamos o telefone como 'authenticatedPhone' para o Service criar/achar o cliente
          authenticatedPhone: manualSchedule.customerPhone,
          authenticatedName: manualSchedule.customerPhone, // Usa o telefone como nome provisório se for novo
        });

        setIsManualScheduleModalOpen(false);
        setManualSchedule({
          customerPhone: "",
          serviceId: "",
          professionalId: "",
          date: "",
          time: "",
        });
        loadData();
        alert("Agendamento criado com sucesso!");
      } catch (error) {
        console.error(error); // Log para ajudar no debug
        alert("Erro ao criar agendamento manual.");
      } finally {
        setIsLoading(false);
      }
    }
    try {
      await api.post("/professionals", { ...newProfessional });
      setIsProfessionalModalOpen(false);
      setNewProfessional({ name: "", email: "", password: "", phone: "" });
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao criar profissional");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleManualScheduleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Formata a data para ISO string, que é o que o backend espera
      const startDateTime = new Date(
        `${manualSchedule.date}T${manualSchedule.time}:00`,
      ).toISOString();

      // 👇 AQUI ESTAVA O ERRO: Os nomes dos campos devem bater com o Controller
      await api.post("/appointments", {
        professionalId: manualSchedule.professionalId, // Antes: user_id
        startTime: startDateTime, // Antes: start_time
        services: [{ id: manualSchedule.serviceId }], // Antes: service_id (agora é array)

        // Enviamos o telefone como 'authenticatedPhone' para o Service criar/achar o cliente
        authenticatedPhone: manualSchedule.customerPhone,
        authenticatedName: manualSchedule.customerPhone, // Usa o telefone como nome provisório se for novo
      });

      setIsManualScheduleModalOpen(false);
      setManualSchedule({
        customerPhone: "",
        serviceId: "",
        professionalId: "",
        date: "",
        time: "",
      });
      loadData();
      alert("Agendamento criado com sucesso!");
    } catch (error) {
      console.error(error); // Log para ajudar no debug
      alert("Erro ao criar agendamento manual.");
    } finally {
      setIsLoading(false);
    }
  }

  // --- AÇÕES DE STATUS ---
  async function handleChangeStatus(id: string, newStatus: string) {
    if (!confirm(`Deseja alterar o status para ${newStatus}?`)) return;

    try {
      await api.patch(`/appointments/${id}`, { status: newStatus });
      loadData();
    } catch (error) {
      alert("Erro ao atualizar status");
    }
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {/* CABEÇALHO COM ABAS */}
        <div>
          <div className={styles.sectionHeader}>
            <div>
              <h1 className={styles.pageTitle}>Painel de Controle</h1>
              <p className={styles.pageSubtitle}>
                Gestão completa da barbearia.
              </p>
            </div>

            <div>
              {activeTab === "appointments" && (
                <Button onClick={() => setIsManualScheduleModalOpen(true)}>
                  <Calendar className="mr-2 h-4 w-4" /> Agendar Manual
                </Button>
              )}
            </div>
          </div>

          {/* Navegação de Abas */}
          <div className={styles.tabs}>
            <button
              onClick={() => setActiveTab("overview")}
              className={cn(
                styles.tabButton,
                activeTab === "overview" && styles.activeTab,
              )}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={cn(
                styles.tabButton,
                activeTab === "appointments" && styles.activeTab,
              )}
            >
              Agenda & Status
            </button>
          </div>
        </div>

        {/* === CONTEÚDO: VISÃO GERAL === */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* --- CARDS DE MÉTRICAS (CORRIGIDOS) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Contagem */}
              <Card className={styles.metricCard}>
                <CardHeader className={styles.metricHeader}>
                  <h3 className={styles.metricTitle}>Agendamentos Hoje</h3>
                  <CalendarDays className="h-4 w-4 text-gold-500" />
                </CardHeader>
                <CardContent>
                  <div className={styles.metricValue}>{metrics.todayCount}</div>
                  <p className={styles.metricFooter}>Clientes agendados</p>
                </CardContent>
              </Card>

              {/* Card 2: Estimado (Prata/Cinza) */}
              <Card className={styles.metricCard}>
                <CardHeader className={styles.metricHeader}>
                  <h3 className={styles.metricTitle}>Estimado</h3>
                  <Clock className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                  {/* CORRIGIDO: Usa estimatedIncome */}
                  <div className="text-3xl font-bold text-zinc-100 mt-2">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(metrics.estimatedIncome)}
                  </div>
                  <p className={styles.metricFooter}>Potencial do dia</p>
                </CardContent>
              </Card>

              {/* Card 3: Confirmado (Ouro) */}
              <Card className={styles.metricCard}>
                <CardHeader className={styles.metricHeader}>
                  <h3 className={styles.metricTitle}>Confirmado</h3>
                  <DollarSign className="h-4 w-4 text-gold-500" />
                </CardHeader>
                <CardContent>
                  {/* CORRIGIDO: Usa confirmedIncome */}
                  <div className={styles.metricValueGold}>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(metrics.confirmedIncome)}
                  </div>
                  <p className={styles.metricFooter}>Já garantido</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Serviços */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <DollarSign className="text-gold-500 h-5 w-5" /> Serviços
                  </h2>
                  <Button
                    onClick={() => setIsServiceModalOpen(true)}
                    className="w-auto h-8 text-xs"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Novo
                  </Button>
                </div>

                <Card className={styles.tableContainer}>
                  <CardContent className="p-0">
                    {services.length === 0 ? (
                      <p className="p-4 text-zinc-500 text-sm">
                        Nenhum serviço.
                      </p>
                    ) : (
                      <table className="w-full text-left text-sm">
                        <tbody className="divide-y divide-zinc-800">
                          {services.map((s) => (
                            <tr key={s.id} className={styles.tableRow}>
                              <td className="px-4 py-3 font-medium text-zinc-300">
                                {s.name}
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-gold-500">
                                {new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(s.price)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Equipe */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="text-gold-500 h-5 w-5" /> Equipe
                  </h2>
                  <Button
                    onClick={() => setIsProfessionalModalOpen(true)}
                    className="w-auto h-8 text-xs"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Contratar
                  </Button>
                </div>

                <Card className={styles.tableContainer}>
                  <CardContent className="p-0">
                    {professionals.length === 0 ? (
                      <p className="p-4 text-zinc-500 text-sm">
                        Nenhum profissional.
                      </p>
                    ) : (
                      <div className="divide-y divide-zinc-800">
                        {professionals.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-3 hover:bg-zinc-800/50 transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-gold-500 font-bold border border-zinc-700">
                                {p.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-zinc-200">
                                  {p.name}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  {p.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* === CONTEÚDO: AGENDA === */}
        {activeTab === "appointments" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className={styles.tableContainer}>
              <CardContent className="p-0">
                {appointments.length === 0 ? (
                  <div className="p-12 text-center">
                    <Calendar className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-zinc-300">
                      Agenda Vazia
                    </h3>
                    <p className="text-zinc-500">
                      Nenhum agendamento encontrado.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-900 text-zinc-400 font-medium border-b border-zinc-800">
                      <tr>
                        <th className="px-4 py-3">Horário</th>
                        <th className="px-4 py-3">Cliente</th>
                        <th className="px-4 py-3">Serviço</th>
                        <th className="px-4 py-3">Profissional</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {appointments.map((app) => (
                        <tr key={app.id} className={styles.tableRow}>
                          <td className="px-4 py-3 font-mono text-zinc-300">
                            {format(
                              parseISO(app.start_time),
                              "dd/MM 'às' HH:mm",
                              { locale: ptBR },
                            )}
                          </td>
                          <td className="px-4 py-3 text-white">
                            {app.customer_phone}
                          </td>
                          <td className="px-4 py-3 text-zinc-300">
                            {app.services?.name || "-"}
                          </td>
                          <td className="px-4 py-3 text-zinc-300">
                            {app.users?.name || "-"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={cn(
                                styles.statusBadge,
                                app.status === "confirmed" &&
                                  styles.statusConfirmed,
                                app.status === "completed" &&
                                  styles.statusCompleted,
                                app.status === "canceled" &&
                                  styles.statusCanceled,
                              )}
                            >
                              {app.status === "confirmed" && "Confirmado"}
                              {app.status === "completed" && "Concluído"}
                              {app.status === "canceled" && "Cancelado"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            {app.status === "confirmed" && (
                              <>
                                <button
                                  title="Concluir"
                                  onClick={() =>
                                    handleChangeStatus(app.id, "completed")
                                  }
                                  className="text-zinc-400 hover:text-green-500 transition-colors"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                                <button
                                  title="Cancelar"
                                  onClick={() =>
                                    handleChangeStatus(app.id, "canceled")
                                  }
                                  className="text-zinc-400 hover:text-red-500 transition-colors"
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* --- MODAIS DE CRIAÇÃO --- */}

      {/* Serviço */}
      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title="Novo Serviço"
      >
        <form onSubmit={handleCreateService} className="space-y-4">
          <Input
            label="Nome"
            value={newService.name}
            onChange={(e) =>
              setNewService({ ...newService, name: e.target.value })
            }
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Preço"
              type="number"
              value={newService.price}
              onChange={(e) =>
                setNewService({ ...newService, price: e.target.value })
              }
              required
            />
            <Input
              label="Duração (min)"
              type="number"
              value={newService.duration}
              onChange={(e) =>
                setNewService({ ...newService, duration: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsServiceModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Salvar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Profissional */}
      <Modal
        isOpen={isProfessionalModalOpen}
        onClose={() => setIsProfessionalModalOpen(false)}
        title="Novo Profissional"
      >
        <form onSubmit={handleCreateProfessional} className="space-y-4">
          <Input
            label="Nome"
            value={newProfessional.name}
            onChange={(e) =>
              setNewProfessional({ ...newProfessional, name: e.target.value })
            }
            required
          />
          <Input
            label="E-mail"
            type="email"
            value={newProfessional.email}
            onChange={(e) =>
              setNewProfessional({ ...newProfessional, email: e.target.value })
            }
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Senha"
              type="password"
              value={newProfessional.password}
              onChange={(e) =>
                setNewProfessional({
                  ...newProfessional,
                  password: e.target.value,
                })
              }
              required
            />
            <Input
              label="Telefone"
              value={newProfessional.phone}
              onChange={(e) =>
                setNewProfessional({
                  ...newProfessional,
                  phone: e.target.value,
                })
              }
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsProfessionalModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Contratar
            </Button>
          </div>
        </form>
      </Modal>

      {/* AGENDAMENTO MANUAL */}
      <Modal
        isOpen={isManualScheduleModalOpen}
        onClose={() => setIsManualScheduleModalOpen(false)}
        title="Agendamento Manual"
      >
        <form onSubmit={handleManualScheduleSubmit} className="space-y-4">
          <Input
            label="Telefone do Cliente / Nome"
            placeholder="(00) 00000-0000"
            value={manualSchedule.customerPhone}
            onChange={(e) =>
              setManualSchedule({
                ...manualSchedule,
                customerPhone: e.target.value,
              })
            }
            required
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300">
              Profissional
            </label>
            <select
              className={styles.selectInput}
              value={manualSchedule.professionalId}
              onChange={(e) =>
                setManualSchedule({
                  ...manualSchedule,
                  professionalId: e.target.value,
                })
              }
              required
            >
              <option value="">Selecione...</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300">Serviço</label>
            <select
              className={styles.selectInput}
              value={manualSchedule.serviceId}
              onChange={(e) =>
                setManualSchedule({
                  ...manualSchedule,
                  serviceId: e.target.value,
                })
              }
              required
            >
              <option value="">Selecione...</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - R$ {s.price}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data"
              type="date"
              value={manualSchedule.date}
              onChange={(e) =>
                setManualSchedule({ ...manualSchedule, date: e.target.value })
              }
              required
            />
            <Input
              label="Horário"
              type="time"
              value={manualSchedule.time}
              onChange={(e) =>
                setManualSchedule({ ...manualSchedule, time: e.target.value })
              }
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsManualScheduleModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Agendar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
