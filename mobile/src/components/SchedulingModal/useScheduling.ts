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
          // Pega o array dentro do objeto retornado
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
    if (selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  }

  // 👇 CORREÇÃO AQUI
  async function handleFinish() {
    if (!selectedSlot) return;
    setLoading(true);

    try {
      // Combina Data (YYYY-MM-DD) + Hora (HH:mm) para formar ISO válido
      // Ex: 2026-01-29T14:30:00
      const fullDateTime = `${selectedDate}T${selectedSlot}:00`;

      await api.post("/mobile/appointments", {
        professionalId: selectedPro,
        startTime: fullDateTime, // AGORA SIM É UMA DATA VÁLIDA
        services: selectedServices.map((s) => ({
          id: s.id,
          duration: s.duration_minutes,
        })),
      });
      onSuccess();
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível realizar o agendamento.");
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
