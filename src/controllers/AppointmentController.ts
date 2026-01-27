import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class AppointmentController {
  // 1. LISTAR
  async index(req: Request, res: Response) {
    try {
      const tenant_id = (req as any).tenant_id;

      const appointments = await prisma.appointments.findMany({
        where: { tenant_id },
        include: {
          services: true,
          users: true,
          customers: true, // Incluímos o cliente para mostrar o nome/telefone
        },
        orderBy: { start_time: "desc" },
      });

      // Mapeamos para o formato que o Frontend espera
      const formattedAppointments = appointments.map((app) => ({
        id: app.id,
        // Se tiver cliente vinculado, usa o telefone dele. Senão, vazio.
        customer_phone: app.customers?.phone || "Sem telefone",
        customer_name: app.customers?.name || "Cliente",
        start_time: app.start_time,
        status: app.status,
        services: app.services,
        users: app.users,
      }));

      return res.json(formattedAppointments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao listar agendamentos" });
    }
  }

  // 2. CRIAR MANUAL (CORRIGIDO)
  async store(req: Request, res: Response) {
    try {
      const tenant_id = (req as any).tenant_id;
      // Recebemos 'user_id' do front, mas no banco é o profissional
      const { customer_phone, service_id, user_id, start_time, status } =
        req.body;

      if (!customer_phone || !service_id || !user_id || !start_time) {
        return res.status(400).json({ error: "Faltam dados obrigatórios." });
      }

      const dateStart = new Date(start_time);

      // Busca duração do serviço
      const service = await prisma.services.findUnique({
        where: { id: service_id },
      });
      if (!service)
        return res.status(400).json({ error: "Serviço não encontrado" });

      const dateEnd = new Date(
        dateStart.getTime() + service.duration_minutes * 60000,
      );

      // --- LÓGICA DE CLIENTE (NOVO) ---
      // Verifica se cliente já existe pelo telefone nesta barbearia
      let customer = await prisma.customers.findFirst({
        where: {
          phone: customer_phone,
          tenant_id,
        },
      });

      // Se não existir, cria um cliente novo automaticamente
      if (!customer) {
        customer = await prisma.customers.create({
          data: {
            name: "Cliente Manual", // Nome provisório ou vindo do input se tiver
            phone: customer_phone,
            tenant_id,
          },
        });
      }

      // --- CRIAÇÃO DO AGENDAMENTO (CORRIGIDO) ---
      const appointment = await prisma.appointments.create({
        data: {
          start_time: dateStart,
          end_time: dateEnd,
          status: status || "confirmed",

          // RELACIONAMENTOS (Sintaxe correta do Prisma)
          tenants: {
            connect: { id: tenant_id },
          },
          services: {
            connect: { id: service_id },
          },
          users: {
            connect: { id: user_id }, // Conecta ao profissional
          },
          customers: {
            connect: { id: customer.id }, // Conecta ao cliente encontrado/criado
          },
        },
      });

      return res.json(appointment);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error); // Log detalhado
      return res
        .status(500)
        .json({ error: "Erro interno ao criar agendamento" });
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
