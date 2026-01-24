import { Request, Response } from "express";
import { ListAvailabilityService } from "../services/ListAvailabilityService";

export class AvailabilityController {
  async handle(req: Request, res: Response) {
    const { date, barberId, tenantId } = req.query as any;

    const service = new ListAvailabilityService();

    try {
      const result = await service.execute({
        date,
        barberId,
        tenantId,
      });
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: "Erro ao listar disponibilidade" });
    }
  }
}
