import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { CreateAppointmentService } from "../services/CreateAppointmentService";

export class AppointmentController {
  // 1. LISTAR (Painel Web)
  async index(req: Request, res: Response) {
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

  // 2. CRIAR
  async store(req: Request, res: Response) {
    try {
      const { professionalId, startTime, services, customerId } = req.body;
      const { authenticatedPhone, authenticatedName } = req.body;

      let tenantId = req.tenant_id || req.body.tenantId;

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

  // 3. ATUALIZAR STATUS (Painel Web)
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

  // 4. LISTAR AGENDAMENTOS DO CLIENTE (MOBILE) - NOVO
  async listMobile(req: Request, res: Response) {
    const { authenticatedPhone } = req.body; // Injetado pelo middleware

    try {
      // 1. Achar todos os "IDs de cliente" que esse telefone tem nas barbearias
      const customers = await prisma.customers.findMany({
        where: { phone: authenticatedPhone },
        select: { id: true },
      });

      const customerIds = customers.map((c) => c.id);

      // 2. Buscar agendamentos desses IDs
      const appointments = await prisma.appointments.findMany({
        where: {
          customer_id: { in: customerIds },
        },
        include: {
          tenants: { select: { name: true } }, // Nome da barbearia
          services: { select: { name: true, price: true } },
          users: { select: { name: true } }, // Nome do Barbeiro
        },
        orderBy: { start_time: "desc" },
      });

      return res.json(appointments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar histórico." });
    }
  }

  // 5. CANCELAR AGENDAMENTO (MOBILE) - NOVO
  async cancelMobile(req: Request, res: Response) {
    const { id } = req.params;
    const { authenticatedPhone } = req.body;

    try {
      // 1. Verificar se esse agendamento pertence mesmo ao dono do telefone
      const appointment = await prisma.appointments.findUnique({
        where: { id },
        include: { customers: true },
      });

      if (!appointment || appointment.customers?.phone !== authenticatedPhone) {
        return res.status(403).json({ error: "Permissão negada." });
      }

      // 2. Cancelar
      await prisma.appointments.update({
        where: { id },
        data: { status: "cancelled" },
      });

      return res.status(200).send();
    } catch (error) {
      return res.status(500).json({ error: "Erro ao cancelar." });
    }
  }
}
