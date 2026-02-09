import { useState, useEffect } from "react";
import { Alert } from "react-native";
import api from "../../../services/API";

export interface DaySchedule {
  day_of_week: number; // 0=Dom, 1=Seg, ...
  enabled: boolean;
  start_time: string;
  end_time: string;
  lunch_start: string;
  lunch_end: string;
}

const DEFAULT_SCHEDULE: DaySchedule[] = [
  {
    day_of_week: 1,
    enabled: true,
    start_time: "09:00",
    end_time: "18:00",
    lunch_start: "12:00",
    lunch_end: "13:00",
  }, // Seg
  {
    day_of_week: 2,
    enabled: true,
    start_time: "09:00",
    end_time: "18:00",
    lunch_start: "12:00",
    lunch_end: "13:00",
  }, // Ter
  {
    day_of_week: 3,
    enabled: true,
    start_time: "09:00",
    end_time: "18:00",
    lunch_start: "12:00",
    lunch_end: "13:00",
  }, // Qua
  {
    day_of_week: 4,
    enabled: true,
    start_time: "09:00",
    end_time: "18:00",
    lunch_start: "12:00",
    lunch_end: "13:00",
  }, // Qui
  {
    day_of_week: 5,
    enabled: true,
    start_time: "09:00",
    end_time: "19:00",
    lunch_start: "12:00",
    lunch_end: "13:00",
  }, // Sex
  {
    day_of_week: 6,
    enabled: true,
    start_time: "09:00",
    end_time: "17:00",
    lunch_start: "",
    lunch_end: "",
  }, // Sáb
  {
    day_of_week: 0,
    enabled: false,
    start_time: "00:00",
    end_time: "00:00",
    lunch_start: "",
    lunch_end: "",
  }, // Dom
];

export function useAvailability() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, []);

  async function loadAvailability() {
    try {
      setLoading(true);
      const response = await api.get("/availability");

      // Se já tiver dados no banco, mescla com o padrão para garantir formato
      if (response.data && response.data.length > 0) {
        const remoteData = response.data;

        const merged = DEFAULT_SCHEDULE.map((def) => {
          const found = remoteData.find(
            (r: any) => r.day_of_week === def.day_of_week,
          );
          return found
            ? { ...def, ...found, enabled: true }
            : { ...def, enabled: false };
        });

        setSchedule(merged);
      }
    } catch (error) {
      console.log("Erro ao carregar horários", error);
    } finally {
      setLoading(false);
    }
  }

  function handleToggleDay(dayIndex: number) {
    const newSchedule = [...schedule];
    const target = newSchedule.find((d) => d.day_of_week === dayIndex);
    if (target) {
      target.enabled = !target.enabled;
      setSchedule(newSchedule);
    }
  }

  function handleChangeTime(
    dayIndex: number,
    field: keyof DaySchedule,
    value: string,
  ) {
    const newSchedule = [...schedule];
    const target = newSchedule.find((d) => d.day_of_week === dayIndex);
    if (target) {
      // @ts-ignore
      target[field] = value;
      setSchedule(newSchedule);
    }
  }

  async function handleSave() {
    try {
      setLoading(true);

      // Filtra apenas os dias habilitados para salvar/atualizar
      const activeDays = schedule.filter((d) => d.enabled);

      await api.put("/availability", { schedule: activeDays });

      Alert.alert("Sucesso", "Seus horários foram atualizados!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar os horários.");
    } finally {
      setLoading(false);
    }
  }

  const daysLabel = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  return {
    schedule,
    loading,
    daysLabel,
    handleToggleDay,
    handleChangeTime,
    handleSave,
  };
}
