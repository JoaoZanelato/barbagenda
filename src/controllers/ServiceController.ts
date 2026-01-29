import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class ServiceController {
  // CRIAR SERVIÇO
  async create(req: Request, res: Response) {
    const { name, price, duration, description } = req.body;
    const tenant_id = (req as any).tenant_id;

    const service = await prisma.services.create({
      data: {
        name,
        price: Number(price),
        duration_minutes: Number(duration),
        description,
        tenant_id,
        active: true, // Garante que nasce ativo
      },
    });

    return res.json(service);
  }

  // LISTAR SERVIÇOS (Apenas Ativos)
  async list(req: Request, res: Response) {
    const tenant_id = (req as any).tenant_id;

    const services = await prisma.services.findMany({
      where: {
        tenant_id,
        active: true, // 👇 MUDANÇA: Só traz os que não foram "deletados"
      },
      orderBy: { name: "asc" },
    });

    return res.json(services);
  }

  // DELETAR SERVIÇO (Soft Delete - Exclusão Lógica)
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const tenant_id = (req as any).tenant_id;

    // 1. Verifica se existe
    const service = await prisma.services.findFirst({
      where: { id, tenant_id },
    });

    if (!service) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    // 2. MUDANÇA CRUCIAL: Atualiza para inativo em vez de deletar
    // Isso evita o erro de "Foreign Key Constraint" e mantém o histórico.
    await prisma.services.update({
      where: { id },
      data: { active: false }, // <--- O segredo está aqui
    });

    return res.status(204).send();
  }
}
