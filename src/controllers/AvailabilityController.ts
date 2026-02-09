import { Request, Response } from "express";
import { ListAvailabilityService } from "../services/ListAvailabilityService";
import { UpdateAvailabilityService } from "../services/UpdateAvailabilityService";
import { prisma } from "../prisma/client";

export class AvailabilityController {
  // LISTAR SLOTS (Para o cliente escolher horário) - Mantido
  async handle(req: Request, res: Response) {
    const { date, barberId, tenantId } = req.query as any;
    const service = new ListAvailabilityService();
    try {
      const result = await service.execute({ date, barberId, tenantId });
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: "Erro ao listar disponibilidade" });
    }
  }

  // BUSCAR CONFIGURAÇÃO ATUAL (Para o barbeiro ver na tela)
  async index(req: Request, res: Response) {
    const { tenant_id } = req as any; // Vem do middleware de auth

    const availability = await prisma.operating_hours.findMany({
      where: { tenant_id },
      orderBy: { day_of_week: "asc" },
    });

    return res.json(availability);
  }

  // ATUALIZAR CONFIGURAÇÃO (Salvar novos horários)
  async update(req: Request, res: Response) {
    const { tenant_id } = req as any;
    const { schedule } = req.body;

    const service = new UpdateAvailabilityService();

    try {
      const result = await service.execute({
        tenant_id,
        schedule,
      });
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: "Erro ao atualizar horários" });
    }
  }
}
