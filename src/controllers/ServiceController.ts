import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class ServiceController {
  // CRIAR SERVIÇO
  async create(req: Request, res: Response) {
    const { name, price, duration, description } = req.body;

    // O ID da barbearia vem do token (segurança total!)
    const tenant_id = (req as any).tenant_id;

    const service = await prisma.services.create({
      data: {
        name,
        price: Number(price), // Garante que é número
        duration_minutes: Number(duration),
        description,
        tenant_id,
      },
    });

    return res.json(service);
  }

  // LISTAR SERVIÇOS (Do meu salão apenas)
  async list(req: Request, res: Response) {
    const tenant_id = (req as any).tenant_id;

    const services = await prisma.services.findMany({
      where: { tenant_id },
      orderBy: { name: "asc" },
    });

    return res.json(services);
  }

  // DELETAR SERVIÇO
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const tenant_id = (req as any).tenant_id;

    // Verifica se o serviço pertence mesmo a esse salão antes de deletar
    const service = await prisma.services.findFirst({
      where: { id, tenant_id },
    });

    if (!service) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    await prisma.services.delete({ where: { id } });

    return res.status(204).send();
  }
}
