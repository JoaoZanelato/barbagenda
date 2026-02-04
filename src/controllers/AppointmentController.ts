import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { NotificationService } from "../services/NotificationService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const notificationService = new NotificationService();

export class AppointmentController {
  // 1. LISTAGEM (Painel)
  async index(req: Request, res: Response) {
    const { start_time, end_time } = req.query;
    const tenant_id = req.tenant_id;

    // Filtro dinâmico de datas
    const where: any = { tenant_id };
    if (start_time && end_time) {
      where.start_time = {
        gte: new Date(String(start_time)),
        lte: new Date(String(end_time)),
      };
    }

    try {
      const appointments = await prisma.appointments.findMany({
        where,
        include: {
          app_client: {
            select: { id: true, name: true, phone: true, avatar_url: true },
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

  // 2. CRIAÇÃO (App Cliente -> Avisa Barbeiro)
  async store(req: Request, res: Response) {
    const { professional_id, service_id, start_time } = req.body;
    const { authenticatedPhone } = req.body;

    if (!professional_id)
      return res.status(400).json({ error: "Profissional não informado." });

    const appClient = await prisma.app_clients.findUnique({
      where: { phone: authenticatedPhone },
    });
    if (!appClient)
      return res.status(401).json({ error: "Cliente não autenticado." });

    const professional = await prisma.users.findUnique({
      where: { id: professional_id },
      select: { tenant_id: true, push_token: true, name: true }, // Pega token
    });

    if (!professional || !professional.tenant_id)
      return res.status(400).json({ error: "Profissional inválido." });

    const service = await prisma.services.findUnique({
      where: { id: service_id },
    });
    if (!service)
      return res.status(400).json({ error: "Serviço não encontrado." });

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

    // 👇 NOTIFICAÇÃO RICA PARA O BARBEIRO
    if (professional.push_token) {
      const dia = format(new Date(start_time), "dd 'de' MMMM", {
        locale: ptBR,
      });
      const hora = format(new Date(start_time), "HH:mm");

      await notificationService.send(
        professional.push_token,
        "✂️ Novo Agendamento!",
        `${appClient.name} marcou ${service.name}\n📅 ${dia} às ${hora}`,
        { screen: "BarberAgenda" }, // Redireciona para Agenda
      );
    }

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

  // 4. CANCELAR (App Cliente -> Avisa Barbeiro)
  async cancelMobile(req: Request, res: Response) {
    const { id } = req.params;
    const { authenticatedPhone } = req.body;

    const appClient = await prisma.app_clients.findUnique({
      where: { phone: authenticatedPhone },
    });
    if (!appClient) return res.status(401).json({ error: "Não autorizado" });

    const appointment = await prisma.appointments.findUnique({
      where: { id },
      include: { users: true }, // Inclui dados do barbeiro
    });

    if (!appointment || appointment.app_client_id !== appClient.id) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    await prisma.appointments.update({
      where: { id },
      data: { status: "cancelled" },
    });

    // 👇 AVISA O BARBEIRO
    if (appointment.users?.push_token) {
      const hora = format(new Date(appointment.start_time), "HH:mm");
      await notificationService.send(
        appointment.users.push_token,
        "❌ Agendamento Cancelado",
        `O cliente ${appClient.name} cancelou o horário das ${hora}.`,
        { screen: "BarberAgenda" },
      );
    }

    return res.status(200).send();
  }

  // 5. ATUALIZAR STATUS (Barbeiro -> Avisa Cliente)
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await prisma.appointments.update({
      where: { id },
      data: { status },
      include: { app_client: true, services: true },
    });

    // 👇 AVISA O CLIENTE
    if (appointment.app_client?.push_token) {
      let title = "Atualização do Agendamento";
      let body = `Seu status mudou para ${status}.`;

      if (status === "COMPLETED") {
        title = "✅ Visual Novo!";
        body = `Seu corte de ${appointment.services?.name} foi concluído. O que achou?`;
      } else if (status === "CANCELLED") {
        title = "🚫 Agendamento Cancelado";
        body = "O barbeiro precisou cancelar seu horário. Toque para remarcar.";
      }

      await notificationService.send(
        appointment.app_client.push_token,
        title,
        body,
        { screen: "ClientAppointments" }, // Redireciona para Histórico
      );
    }

    return res.status(200).send();
  }
}
