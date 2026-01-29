import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { parseISO, addMinutes, isValid } from "date-fns";

export class AppointmentController {
  // Listar agendamentos (Para o Painel do Barbeiro)
  async index(req: Request, res: Response) {
    const { start_date, end_date } = req.query;
    const tenantId = req.user_tenant_id; // Pega do token

    // Filtros básicos de data
    const where: any = { tenant_id: tenantId };

    if (start_date && end_date) {
      where.start_time = {
        gte: parseISO(String(start_date)),
        lte: parseISO(String(end_date)),
      };
    }

    const appointments = await prisma.appointments.findMany({
      where,
      include: {
        customers: true,
        services: true,
        users: true,
      },
      orderBy: { start_time: "asc" },
    });

    return res.json(appointments);
  }

  // Agendamento Simples (Legado ou Admin manual)
  async store(req: Request, res: Response) {
    const { professionalId, customerId, serviceId, startTime } = req.body;
    const tenantId = req.user_tenant_id;

    const service = await prisma.services.findUnique({
      where: { id: serviceId },
    });
    if (!service)
      return res.status(400).json({ error: "Serviço não encontrado" });

    const startDate = parseISO(startTime);
    const endDate = addMinutes(startDate, service.duration_minutes);

    const appointment = await prisma.appointments.create({
      data: {
        start_time: startDate,
        end_time: endDate,
        status: "confirmed",
        tenant_id: tenantId,
        user_id: professionalId,
        customer_id: customerId,
        service_id: serviceId,
      },
    });

    return res.json(appointment);
  }

  // --- NOVO: Agendamento Múltiplo (Para o App Mobile) ---
  // Permite agendar "Corte" + "Barba" na sequência
  async createBatch(req: Request, res: Response) {
    // Nota: O App envia um array de 'services' [{id, duration}]
    const { professionalId, customerName, customerPhone, startTime, services } =
      req.body;

    // O tenantId vem do Token (se logado) ou do Body (se for app público do cliente)
    // Para simplificar, vamos assumir que o App manda o tenantId ou usa um fixo por enquanto
    // Se o usuário estiver logado:
    const tenantId = req.user_tenant_id;

    if (!services || services.length === 0) {
      return res.status(400).json({ error: "Nenhum serviço selecionado." });
    }

    try {
      // 1. Busca ou Cria o Cliente pelo Telefone
      let customer = await prisma.customers.findFirst({
        where: { phone: customerPhone, tenant_id: tenantId },
      });

      if (!customer) {
        customer = await prisma.customers.create({
          data: {
            name: customerName || "Cliente App",
            phone: customerPhone,
            tenant_id: tenantId,
          },
        });
      }

      // 2. Loop para criar os agendamentos sequenciais
      let currentStartTime = parseISO(startTime); // Data inicial escolhida

      if (!isValid(currentStartTime)) {
        return res.status(400).json({ error: "Data inválida." });
      }

      const createdAppointments = [];

      for (const service of services) {
        // Calcula fim deste serviço
        const currentEndTime = addMinutes(currentStartTime, service.duration);

        const appointment = await prisma.appointments.create({
          data: {
            start_time: currentStartTime,
            end_time: currentEndTime,
            status: "confirmed",
            // Conecta usando IDs
            services: { connect: { id: service.id } },
            users: { connect: { id: professionalId } },
            customers: { connect: { id: customer.id } },
            tenants: { connect: { id: tenantId } },
          },
        });

        createdAppointments.push(appointment);

        // O próximo serviço começa exatamente quando este termina
        currentStartTime = currentEndTime;
      }

      return res.status(201).json({
        message: "Agendamento realizado com sucesso!",
        appointments: createdAppointments,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao processar agendamento." });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await prisma.appointments.update({
      where: { id },
      data: { status },
    });

    return res.json(appointment);
  }
}
