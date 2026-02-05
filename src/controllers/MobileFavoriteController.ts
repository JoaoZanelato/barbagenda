import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class MobileFavoriteController {
  // 1. LISTAR FAVORITOS
  async index(req: Request, res: Response) {
    const client_id = (req as any).user_id; // 👈 Pega ID direto do token

    try {
      const favorites = await prisma.client_favorites.findMany({
        where: { client_id },
        include: {
          tenant: true,
        },
      });

      const tenants = favorites.map((fav) => fav.tenant);
      return res.json(tenants);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar favoritos." });
    }
  }

  // 2. TOGGLE (Adicionar/Remover)
  async toggle(req: Request, res: Response) {
    const client_id = (req as any).user_id; // 👈 Pega ID direto do token
    const { tenantId } = req.params;

    try {
      // Verifica se já é favorito
      const existingFavorite = await prisma.client_favorites.findUnique({
        where: {
          client_id_tenant_id: {
            client_id,
            tenant_id: tenantId,
          },
        },
      });

      if (existingFavorite) {
        // Remove
        await prisma.client_favorites.delete({
          where: { id: existingFavorite.id },
        });
        return res.json({ message: "Removido", isFavorite: false });
      } else {
        // Adiciona
        await prisma.client_favorites.create({
          data: {
            client_id,
            tenant_id: tenantId,
          },
        });
        return res.json({ message: "Adicionado", isFavorite: true });
      }
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar favorito." });
    }
  }
}
