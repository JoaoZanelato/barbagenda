import { useState, useEffect } from "react";
import { Alert } from "react-native";
import api from "../../../services/API";

export function useClientHome() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados de Favoritos
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]); // Lista de IDs favoritados
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      // 1. Busca TODAS as barbearias
      const responseTenants = await api.get("/mobile/tenants");
      setTenants(responseTenants.data);

      // 2. Busca os FAVORITOS do usuário na API
      const responseFavorites = await api.get("/mobile/favorites");
      // A API retorna objetos completos, extraímos apenas os IDs para facilitar a verificação
      const ids = responseFavorites.data.map((t: any) => t.id);
      setFavoriteIds(ids);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite(tenantId: string) {
    // Atualização Otimista (Muda na tela antes de confirmar no servidor)
    const previouslyFavorite = favoriteIds.includes(tenantId);
    let newFavoritesList = [...favoriteIds];

    if (previouslyFavorite) {
      newFavoritesList = newFavoritesList.filter((id) => id !== tenantId);
    } else {
      newFavoritesList.push(tenantId);
    }
    setFavoriteIds(newFavoritesList);

    try {
      // Chama a API para persistir
      await api.post(`/mobile/favorites/${tenantId}/toggle`);
    } catch (error) {
      // Se der erro, reverte a mudança visual
      Alert.alert("Erro", "Não foi possível atualizar o favorito.");
      setFavoriteIds(favoriteIds); // Volta ao estado anterior
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

  // Lógica de Filtro na Tela
  const displayedTenants = showFavoritesOnly
    ? tenants.filter((t) => favoriteIds.includes(t.id))
    : tenants;

  return {
    tenants: displayedTenants,
    loading,
    selectedTenant,
    isModalOpen,
    favorites: favoriteIds, // Passamos a lista de IDs para a View saber quem pintar de vermelho
    showFavoritesOnly,
    setShowFavoritesOnly,
    toggleFavorite,
    handleSelectTenant,
    handleCloseModal,
    handleSuccess,
  };
}
