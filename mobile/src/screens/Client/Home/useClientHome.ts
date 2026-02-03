import { useState, useEffect } from "react";
import { Alert } from "react-native";
import api from "../../../services/API";

export function useClientHome() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null); // Estado para guardar o usuário
  const [loading, setLoading] = useState(true);

  // Controle do Modal
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Favoritos
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // setLoading(true); // Opcional, para não piscar sempre que entra

      // Busca em paralelo: Perfil, Lojas e Favoritos
      const [userRes, tenantsRes, favoritesRes] = await Promise.all([
        api.get("/mobile/profile"),
        api.get("/mobile/tenants"),
        api.get("/mobile/favorites"),
      ]);

      setUser(userRes.data);
      setTenants(tenantsRes.data);

      const ids = favoritesRes.data.map((t: any) => t.id);
      setFavorites(ids);
    } catch (error) {
      console.error("Erro ao carregar dados da home:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite(tenantId: string) {
    const previouslyFavorite = favorites.includes(tenantId);
    let newFavoritesList = [...favorites];

    if (previouslyFavorite) {
      newFavoritesList = newFavoritesList.filter((id) => id !== tenantId);
    } else {
      newFavoritesList.push(tenantId);
    }
    setFavorites(newFavoritesList);

    try {
      await api.post(`/mobile/favorites/${tenantId}/toggle`);
    } catch (error) {
      setFavorites(favorites);
      Alert.alert("Erro", "Não foi possível atualizar o favorito.");
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

  const displayedTenants = showFavoritesOnly
    ? tenants.filter((t) => favorites.includes(t.id))
    : tenants;

  return {
    tenants: displayedTenants,
    user, // Retorna o usuário para a View
    loading,
    selectedTenant,
    isModalOpen,
    favorites,
    showFavoritesOnly,
    setShowFavoritesOnly,
    handleSelectTenant,
    handleCloseModal,
    handleSuccess,
    toggleFavorite,
  };
}
