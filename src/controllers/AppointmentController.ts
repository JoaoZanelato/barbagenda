import { Request, Response } from "express";
import { CreateAppointmentService } from "../services/CreateAppointmentService";

export class AppointmentController {
  async handle(req: Request, res: Response) {
    const {
      tenantId,
      professionalId,
      serviceId,
      customerName,
      customerPhone,
      startTime,
    } = req.body;

    const service = new CreateAppointmentService();

    try {
      const agendamento = await service.execute({
        tenantId,
        professionalId,
        serviceId,
        customerName,
        customerPhone,
        startTime,
      });
      return res.json(agendamento);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
