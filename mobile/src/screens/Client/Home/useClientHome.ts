import { useState, useEffect } from "react";
import { Alert } from "react-native";
import api from "../../../services/API"; // 👈 Importa a config com seu IP 192...

export function useClientHome() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
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

  // 👇 FUNÇÃO MÁGICA: Corrige o link da imagem usando o IP do API.ts
  const fixImageURL = (url: string) => {
    if (!url) return null;

    // Pega o IP configurado no services/API.ts (http://192.168.0.105:3333)
    const baseURL = api.defaults.baseURL;

    if (!baseURL) return url;

    // Se a imagem vier do banco como localhost ou 127.0.0.1, troca pelo IP correto
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      return url.replace(/http:\/\/(localhost|127\.0\.0\.1):3333/g, baseURL);
    }

    return url;
  };

  async function loadData() {
    try {
      // Busca tudo junto
      const [userRes, tenantsRes, favoritesRes] = await Promise.all([
        api.get("/mobile/profile"),
        api.get("/mobile/tenants"),
        api.get("/mobile/favorites"),
      ]);

      // 1. Corrige Foto do Perfil
      let userData = userRes.data;
      if (userData.avatar_url) {
        userData.avatar_url = fixImageURL(userData.avatar_url);
      }
      setUser(userData);

      // 2. Corrige Logos das Barbearias
      const formattedTenants = tenantsRes.data.map((tenant: any) => ({
        ...tenant,
        logo_url: fixImageURL(tenant.logo_url), // 👈 Aplica a correção aqui
      }));

      setTenants(formattedTenants);

      const ids = favoritesRes.data.map((t: any) => t.id);
      setFavorites(ids);
    } catch (error) {
      console.error("Erro ao carregar Home:", error);
    } finally {
      setLoading(false);
    }
  }

  // --- Funções de Ação (Favoritar, Modal) ---

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
      setFavorites(favorites); // Reverte visualmente se falhar
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
    user,
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
