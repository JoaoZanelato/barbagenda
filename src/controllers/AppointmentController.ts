import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class AppointmentController {
  // 1. LISTAGEM (O que o Barbeiro vê no Painel)
  async index(req: Request, res: Response) {
    const { start_time, end_time } = req.query;
    const tenant_id = req.tenant_id; // Vem do token do barbeiro

    try {
      const appointments = await prisma.appointments.findMany({
        where: {
          tenant_id,
          start_time: {
            gte: new Date(String(start_time)),
            lte: new Date(String(end_time)),
          },
        },
        include: {
          app_client: {
            select: {
              id: true,
              name: true,
              phone: true,
              avatar_url: true,
            },
          },
          customers: true,
          services: true,
          users: true,
        },
        orderBy: { start_time: "asc" },
      });

      const formatted = appointments.map((app) => ({
        ...app,
        client_name: app.app_client?.name || app.customers?.name || "Cliente",
        client_avatar: app.app_client?.avatar_url || null,
        client_phone: app.app_client?.phone || app.customers?.phone,
      }));

      return res.json(formatted);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao listar agendamentos." });
    }
  }

  // 2. CRIAÇÃO PELO APP
  async store(req: Request, res: Response) {
    const { professional_id, service_id, start_time } = req.body;
    const { authenticatedPhone } = req.body;

    // Validação Obrigatória para evitar erro no Prisma
    if (!professional_id) {
      return res.status(400).json({ error: "Profissional não informado." });
    }

    const appClient = await prisma.app_clients.findUnique({
      where: { phone: authenticatedPhone },
    });

    if (!appClient) {
      return res.status(401).json({ error: "Cliente não autenticado." });
    }

    const professional = await prisma.users.findUnique({
      where: { id: professional_id },
      select: { tenant_id: true },
    });

    if (!professional || !professional.tenant_id) {
      return res.status(400).json({ error: "Profissional inválido." });
    }

    const service = await prisma.services.findUnique({
      where: { id: service_id },
    });

    if (!service) {
      return res.status(400).json({ error: "Serviço não encontrado." });
    }

    const appointment = await prisma.appointments.create({
      data: {
        tenant_id: professional.tenant_id,
        professional_id,
        service_id,
        start_time: new Date(start_time),
        end_time: new Date(
          new Date(start_time).getTime() + service.duration_minutes * 60000,
        ),
        total_price: service.price,
        app_client_id: appClient.id,
      },
    });

    return res.status(201).json(appointment);
  }

  // 3. MEUS AGENDAMENTOS
  async listMobile(req: Request, res: Response) {
    const { authenticatedPhone } = req.body;

    const appClient = await prisma.app_clients.findUnique({
      where: { phone: authenticatedPhone },
    });

    if (!appClient)
      return res.status(400).json({ error: "Cliente não encontrado" });

    const myAppointments = await prisma.appointments.findMany({
      where: { app_client_id: appClient.id },
      include: {
        tenants: {
          select: {
            name: true,
            phone: true,
            address: true,
            address_num: true,
            neighborhood: true,
          },
        },
        services: true,
        users: true,
      },
      orderBy: { start_time: "desc" },
    });

    return res.json(myAppointments);
  }

  // 4. CANCELAR
  async cancelMobile(req: Request, res: Response) {
    const { id } = req.params;
    const { authenticatedPhone } = req.body;

    const appClient = await prisma.app_clients.findUnique({
      where: { phone: authenticatedPhone },
    });
    if (!appClient) return res.status(401).json({ error: "Não autorizado" });

    const appointment = await prisma.appointments.findUnique({ where: { id } });

    if (!appointment || appointment.app_client_id !== appClient.id) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    await prisma.appointments.update({
      where: { id },
      data: { status: "cancelled" },
    });

    return res.status(200).send();
  }

  // 5. UPDATE
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    await prisma.appointments.update({
      where: { id },
      data: { status },
    });

    return res.status(200).send();
  }
}
