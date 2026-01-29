import { useState, useEffect } from "react";
import { Alert } from "react-native";
import api from "../../../services/API";

export function useClientHome() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTenants();
  }, []);

  async function loadTenants() {
    try {
      const response = await api.get("/mobile/tenants");
      setTenants(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectTenant(tenant: any) {
    setSelectedTenant(tenant);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedTenant(null);
  }

  function handleSuccess() {
    Alert.alert("Sucesso", "Seu agendamento foi realizado!");
    handleCloseModal();
  }

  return {
    tenants,
    loading,
    selectedTenant,
    isModalOpen,
    handleSelectTenant,
    handleCloseModal,
    handleSuccess,
  };
}
