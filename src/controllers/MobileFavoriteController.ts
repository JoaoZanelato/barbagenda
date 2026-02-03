import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class MobileFavoriteController {
  // 1. LISTAR FAVORITOS DO CLIENTE
  async index(req: Request, res: Response) {
    const { authenticatedPhone } = req.body; // Injetado pelo middleware

    try {
      // Busca o cliente pelo telefone
      const client = await prisma.app_clients.findUnique({
        where: { phone: authenticatedPhone },
      });

      if (!client) {
        return res.status(404).json({ error: "Cliente não encontrado." });
      }

      // Busca os favoritos
      const favorites = await prisma.client_favorites.findMany({
        where: { client_id: client.id },
        include: {
          tenant: true, // Traz os dados da barbearia (nome, slug, etc)
        },
      });

      // Retorna apenas a lista de barbearias favoritadas
      const tenants = favorites.map((fav) => fav.tenant);

      return res.json(tenants);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar favoritos." });
    }
  }

  // 2. TOGGLE (Adicionar ou Remover)
  async toggle(req: Request, res: Response) {
    const { authenticatedPhone } = req.body;
    const { tenantId } = req.params; // ID da barbearia vem na URL

    try {
      const client = await prisma.app_clients.findUnique({
        where: { phone: authenticatedPhone },
      });

      if (!client)
        return res.status(404).json({ error: "Cliente não encontrado." });

      // Verifica se já é favorito
      const existingFavorite = await prisma.client_favorites.findUnique({
        where: {
          client_id_tenant_id: {
            client_id: client.id,
            tenant_id: tenantId,
          },
        },
      });

      if (existingFavorite) {
        // SE JÁ EXISTE -> REMOVE (Desfavoritar)
        await prisma.client_favorites.delete({
          where: { id: existingFavorite.id },
        });
        return res.json({
          message: "Removido dos favoritos",
          isFavorite: false,
        });
      } else {
        // SE NÃO EXISTE -> CRIA (Favoritar)
        await prisma.client_favorites.create({
          data: {
            client_id: client.id,
            tenant_id: tenantId,
          },
        });
        return res.json({
          message: "Adicionado aos favoritos",
          isFavorite: true,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao atualizar favorito." });
    }
  }
}
