import { useState, useEffect } from "react";
import api from "../../../services/API";

export function useBarberDashboard() {
  const [activeTab, setActiveTab] = useState<"agenda" | "services" | "metrics">(
    "agenda",
  );
  const [appointments, setAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]); // Recarrega ao trocar de aba (opcional)

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === "agenda") {
        const res = await api.get("/appointments");
        setAppointments(res.data);
      } else if (activeTab === "services") {
        const res = await api.get("/services");
        setServices(res.data);
      } else if (activeTab === "metrics") {
        const res = await api.get("/dashboard/metrics");
        setMetrics(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    activeTab,
    setActiveTab,
    appointments,
    services,
    metrics,
    loading,
    refresh: loadData,
  };
}
