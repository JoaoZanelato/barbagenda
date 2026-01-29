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

  // Seleções do Usuário
  const [selectedPro, setSelectedPro] = useState("");
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [selectedSlot, setSelectedSlot] = useState("");

  // Totais
  const totalDuration = selectedServices.reduce(
    (acc, s) => acc + s.duration_minutes,
    0,
  );
  const totalPrice = selectedServices.reduce(
    (acc, s) => acc + Number(s.price),
    0,
  );

  // 1. Carregar dados ao abrir o modal
  useEffect(() => {
    if (isOpen && tenantId) {
      setLoading(true);
      // Busca detalhes da barbearia específica
      api
        .get(`/mobile/tenants/${tenantId}/details`)
        .then((res) => {
          setPros(res.data.professionals);
          setServices(res.data.services);
          setStep(1);
          setSelectedServices([]);
          setSelectedSlot("");
        })
        .catch(() => Alert.alert("Erro", "Não foi possível carregar os dados."))
        .finally(() => setLoading(false));
    }
  }, [isOpen, tenantId]);

  // 2. Carregar horários quando a data/pro/serviços mudarem
  useEffect(() => {
    if (step === 3 && selectedPro && selectedDate && totalDuration > 0) {
      setLoading(true);
      api
        .get("/disponibilidade", {
          params: {
            date: selectedDate,
            professionalId: selectedPro,
            duration: totalDuration,
          },
        })
        .then((res) => {
          setSlots(res.data);
        })
        .catch(() => setSlots([]))
        .finally(() => setLoading(false));
    }
  }, [step, selectedDate, selectedPro, totalDuration]);

  function toggleService(service: any) {
    if (selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  }

  async function handleFinish() {
    setLoading(true);
    try {
      await api.post("/mobile/appointments", {
        professionalId: selectedPro,
        startTime: selectedSlot,
        // O backend pegará o cliente pelo token JWT
        services: selectedServices.map((s) => ({
          id: s.id,
          duration: s.duration_minutes,
        })),
      });
      onSuccess();
    } catch (err) {
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
