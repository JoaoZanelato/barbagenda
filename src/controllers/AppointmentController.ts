import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class AppointmentController {
  // 1. LISTAR (Para o Dashboard)
  async index(req: Request, res: Response) {
    try {
      const tenant_id = (req as any).tenant_id;

      const appointments = await prisma.appointments.findMany({
        where: {
          tenant_id,
        },
        include: {
          services: true, // <--- CORRIGIDO (era service)
          users: true, // <--- CORRIGIDO (era user)
        },
        orderBy: {
          start_time: "desc",
        },
      });

      return res.json(appointments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao listar agendamentos" });
    }
  }

  // 2. CRIAR MANUAL
  async store(req: Request, res: Response) {
    try {
      const tenant_id = (req as any).tenant_id;
      const { customer_phone, service_id, user_id, start_time, status } =
        req.body;

      if (!customer_phone || !service_id || !user_id || !start_time) {
        return res.status(400).json({ error: "Faltam dados obrigatórios." });
      }

      const dateStart = new Date(start_time);

      const service = await prisma.services.findUnique({
        where: { id: service_id },
      });
      if (!service)
        return res.status(400).json({ error: "Serviço não encontrado" });

      const dateEnd = new Date(
        dateStart.getTime() + service.duration_minutes * 60000,
      );

      const appointment = await prisma.appointments.create({
        data: {
          tenant_id,
          customer_phone,
          service_id,
          user_id,
          start_time: dateStart,
          end_time: dateEnd,
          status: status || "confirmed",
        },
      });

      return res.json(appointment);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao criar agendamento manual" });
    }
  }

  // 3. ATUALIZAR STATUS
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const appointment = await prisma.appointments.update({
        where: { id },
        data: { status },
      });

      return res.json(appointment);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar status" });
    }
  }
}
