import { Request, Response } from "express";
import { ListAvailabilityService } from "../services/ListAvailabilityService";

export class ListAvailabilityController {
  async handle(req: Request, res: Response) {
    const { date, barberId, tenantId } = req.query;

    const listAvailabilityService = new ListAvailabilityService();

    const availability = await listAvailabilityService.execute({
      date: String(date),
      barberId: String(barberId),
      tenantId: String(tenantId),
    });

    return res.json(availability);
  }
}
