import { prisma } from "../prisma/client";
import { parseISO, isValid, addMinutes, format } from "date-fns";
import { NotificationService } from "./NotificationService";

interface IRequest {
  tenantId: string;
  professionalId: string;
  services: { id: string }[];
  startTime: string;
  customerId?: string; // Opcional (Admin)
  authenticatedPhone?: string; // Opcional (Mobile)
  authenticatedName?: string; // Opcional (Mobile)
}

export class CreateAppointmentService {
  async execute({
    tenantId,
    professionalId,
    services,
    startTime,
    customerId,
    authenticatedPhone,
    authenticatedName,
  }: IRequest) {
    const notificationService = new NotificationService();

    // 1. Validações Básicas
    if (!professionalId || !startTime || !services || services.length === 0) {
      throw new Error("Dados incompletos.");
    }

    if (!tenantId) {
      throw new Error("Barbearia não identificada.");
    }

    const startDate = parseISO(startTime);
    if (!isValid(startDate)) {
      throw new Error("Data inválida.");
    }

    // 2. Identificação do Cliente
    let finalCustomerId = customerId;

    if (!finalCustomerId && authenticatedPhone) {
      // Busca cliente pelo telefone
      let customer = await prisma.customers.findFirst({
        where: { phone: authenticatedPhone, tenant_id: tenantId },
      });

      // Se não existir, cria um novo
      if (!customer) {
        customer = await prisma.customers.create({
          data: {
            name: authenticatedName || "Cliente App",
            phone: authenticatedPhone,
            tenant_id: tenantId,
          },
        });
      }
      finalCustomerId = customer.id;
    }

    if (!finalCustomerId) {
      throw new Error("Cliente não identificado.");
    }

    // 3. Buscar e Calcular Serviços (1 Query Otimizada)
    const servicesData = await prisma.services.findMany({
      where: {
        id: { in: services.map((s) => s.id) },
        tenant_id: tenantId,
      },
    });

    if (servicesData.length !== services.length) {
      throw new Error("Um ou mais serviços são inválidos.");
    }

    const totalDuration = servicesData.reduce(
      (acc, s) => acc + s.duration_minutes,
      0,
    );
    const totalPrice = servicesData.reduce(
      (acc, s) => acc + Number(s.price),
      0,
    );

    // Calcula hora final
    const endDate = addMinutes(startDate, totalDuration);

    // 4. Criar Agendamento (Transação no Banco)
    const appointment = await prisma.$transaction(async (tx) => {
      // Pega o primeiro serviço apenas para preencher o campo legado 'service_id'
      const mainServiceId = servicesData[0].id;

      return await tx.appointments.create({
        data: {
          start_time: startDate,
          end_time: endDate,
          status: "SCHEDULED",
          total_price: totalPrice,
          tenant_id: tenantId,
          customer_id: finalCustomerId,
          professional_id: professionalId,
          service_id: mainServiceId, // Campo legado

          // Conecta a lista de serviços
          services: {
            connect: servicesData.map((s) => ({ id: s.id })),
          },
        },
        include: {
          customers: true,
          services: true,
        },
      });
    });

    // 5. Notificar Profissional (Não bloqueia o erro)
    try {
      const professional = await prisma.users.findUnique({
        where: { id: professionalId },
        select: { push_token: true },
      });

      if (professional?.push_token) {
        const dateFormatted = format(startDate, "dd/MM 'às' HH:mm");
        const clientName = appointment.customers?.name || "Novo Cliente";

        await notificationService.send(
          professional.push_token,
          "Novo Agendamento! ✂️",
          `${clientName} agendou para ${dateFormatted}.`,
        );
      }
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
    }

    return appointment;
  }
}
