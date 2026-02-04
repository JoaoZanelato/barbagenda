import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class ReviewController {
  // Criar Avaliação
  async store(req: Request, res: Response) {
    const { tenant_id, rating, comment } = req.body;
    const client_id = (req as any).clientId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Nota deve ser entre 1 e 5" });
    }

    try {
      const review = await prisma.reviews.create({
        data: { tenant_id, client_id, rating, comment },
      });
      return res.status(201).json(review);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar avaliação." });
    }
  }

  // Listar Avaliações
  async list(req: Request, res: Response) {
    const { tenant_id } = req.params;

    try {
      const reviews = await prisma.reviews.findMany({
        where: { tenant_id },
        include: {
          client: { select: { name: true, avatar_url: true } },
        },
        orderBy: { created_at: "desc" },
      });

      // Calcular média
      const aggregations = await prisma.reviews.aggregate({
        where: { tenant_id },
        _avg: { rating: true },
        _count: { rating: true },
      });

      return res.json({
        reviews,
        metrics: {
          average: aggregations._avg.rating || 0,
          count: aggregations._count.rating || 0,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar avaliações" });
    }
  }
}
