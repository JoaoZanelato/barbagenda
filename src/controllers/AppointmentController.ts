import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { CreateAppointmentService } from "../services/CreateAppointmentService";

export class AppointmentController {
  // 1. LISTAR
  async index(req: Request, res: Response) {
    // Usa a tipagem correta que criamos
    const tenant_id = req.tenant_id;

    try {
      const appointments = await prisma.appointments.findMany({
        where: { tenant_id },
        include: {
          customers: { select: { name: true, phone: true } },
          users: { select: { name: true } },
          services: true,
        },
        orderBy: { start_time: "desc" },
      });

      return res.json(appointments);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar agendamentos." });
    }
  }

  // 2. CRIAR (Limpo e Refatorado)
  async store(req: Request, res: Response) {
    try {
      const { professionalId, startTime, services, customerId } = req.body;
      const { authenticatedPhone, authenticatedName } = req.body; // Injetados pelo Middleware Mobile

      // Tenta pegar o tenantId do token (Admin) ou do body (Mobile)
      let tenantId = req.tenant_id || req.body.tenantId;

      // Se ainda não tiver tenantId, tenta descobrir pelo profissional (Fallback)
      if (!tenantId && professionalId) {
        const professional = await prisma.users.findUnique({
          where: { id: professionalId },
          select: { tenant_id: true },
        });
        if (professional) tenantId = professional.tenant_id;
      }

      const createAppointment = new CreateAppointmentService();

      const appointment = await createAppointment.execute({
        tenantId,
        professionalId,
        services,
        startTime,
        customerId,
        authenticatedPhone,
        authenticatedName,
      });

      console.log("Agendamento Criado ID:", appointment.id);
      return res.status(201).json(appointment);
    } catch (error: any) {
      console.error("ERRO AGENDAMENTO:", error.message);
      return res
        .status(400)
        .json({ error: error.message || "Erro ao processar agendamento." });
    }
  }

  // 3. ATUALIZAR STATUS
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const appointment = await prisma.appointments.update({
        where: { id },
        data: { status },
      });
      return res.json(appointment);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar agendamento." });
    }
  }
}
