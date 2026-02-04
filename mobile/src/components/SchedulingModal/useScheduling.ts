import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { format } from "date-fns";
import api from "../../services/API";

export function useScheduling(
  isOpen: boolean,
  onClose: () => void,
  onSuccess: () => void,
  tenantId?: string,
) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dados da API
  const [pros, setPros] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [slots, setSlots] = useState<string[]>([]);

  // Seleções
  const [selectedPro, setSelectedPro] = useState("");
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [selectedSlot, setSelectedSlot] = useState("");

  const totalDuration = selectedServices.reduce(
    (acc, s) => acc + s.duration_minutes,
    0,
  );
  const totalPrice = selectedServices.reduce(
    (acc, s) => acc + Number(s.price),
    0,
  );

  // 1. Carregar dados ao abrir
  useEffect(() => {
    if (isOpen && tenantId) {
      setLoading(true);
      api
        .get(`/mobile/tenants/${tenantId}/details`)
        .then((res) => {
          setPros(res.data.professionals);
          setServices(res.data.services);
          setStep(1);
          setSelectedServices([]);
          setSelectedSlot("");
          setSlots([]);
        })
        .catch(() => Alert.alert("Erro", "Falha ao carregar dados."))
        .finally(() => setLoading(false));
    }
  }, [isOpen, tenantId]);

  // 2. Carregar horários (Disponibilidade)
  useEffect(() => {
    if (step === 3 && selectedPro && selectedDate && totalDuration > 0) {
      setLoading(true);
      setSlots([]); // Limpa enquanto carrega

      api
        .get("/disponibilidade", {
          params: {
            date: selectedDate,
            barberId: selectedPro,
            tenantId,
          },
        })
        .then((res) => {
          setSlots(res.data.horariosLivres || []);
        })
        .catch((err) => {
          console.log("Erro ao buscar slots:", err);
          setSlots([]);
        })
        .finally(() => setLoading(false));
    }
  }, [step, selectedDate, selectedPro, totalDuration, tenantId]);

  function toggleService(service: any) {
    // Lógica para permitir apenas 1 serviço por vez (simplificação para evitar erros no backend atual)
    if (selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices([]);
    } else {
      setSelectedServices([service]);
    }
  }

  // 👇 FUNÇÃO CORRIGIDA PARA ENVIAR OS CAMPOS CERTOS AO BACKEND
  async function handleFinish() {
    if (!selectedSlot || !selectedPro || selectedServices.length === 0) return;
    setLoading(true);

    try {
      const fullDateTime = `${selectedDate}T${selectedSlot}:00`;

      await api.post("/mobile/appointments", {
        // CORREÇÃO: Usando snake_case para bater com o AppointmentController.ts
        professional_id: selectedPro,
        service_id: selectedServices[0].id, // Envia o ID do primeiro serviço selecionado
        start_time: fullDateTime,
      });

      onSuccess();
    } catch (err: any) {
      console.log(err.response?.data || err);
      Alert.alert(
        "Erro",
        err.response?.data?.error || "Não foi possível realizar o agendamento.",
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    step,
    setStep,
    loading,
    pros,
    services,
    slots,
    selectedPro,
    setSelectedPro,
    selectedServices,
    toggleService,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    totalDuration,
    totalPrice,
    handleFinish,
  };
}
