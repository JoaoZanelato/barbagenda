import { prisma } from "../prisma/client";
import { parseISO, isValid, addMinutes, format } from "date-fns";
import { NotificationService } from "./NotificationService";

interface IRequest {
  tenantId: string;
  professionalId: string;
  services: { id: string }[];
  startTime: string;
  customerId?: string;
  authenticatedPhone?: string;
  authenticatedName?: string;
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
      let customer = await prisma.customers.findFirst({
        where: { phone: authenticatedPhone, tenant_id: tenantId },
      });

      if (!customer) {
        customer = await prisma.customers.create({
          data: {
            name: authenticatedName || "Cliente App",
            phone: authenticatedPhone,
            tenant_id: tenantId, // Aqui no create do Customer o ID cru geralmente funciona, mas se der erro trocamos.
          },
        });
      }
      finalCustomerId = customer.id;
    }

    if (!finalCustomerId) {
      throw new Error("Cliente não identificado.");
    }

    // 3. Buscar e Calcular Serviços
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

    const endDate = addMinutes(startDate, totalDuration);

    // 4. Criar Agendamento (CORRIGIDO: Usando connect)
    const appointment = await prisma.$transaction(async (tx) => {
      // Pega o primeiro serviço para o campo principal (caso sua lógica use ele)
      const mainServiceId = servicesData[0].id;

      return await tx.appointments.create({
        data: {
          start_time: startDate,
          end_time: endDate,
          status: "SCHEDULED",
          total_price: totalPrice,

          // 👇 AQUI ESTAVA O ERRO: Trocamos IDs crus por conexões relacionais
          tenants: {
            connect: { id: tenantId },
          },
          customers: {
            connect: { id: finalCustomerId },
          },
          users: {
            // 'users' é o nome da relação para professional_id no seu schema
            connect: { id: professionalId },
          },

          // Se o seu sistema suporta Múltiplos serviços, usa array no services
          // Se suporta apenas UM, usa connect simples no 'services' (singular)
          // Vou manter a lógica de conectar o serviço principal para garantir compatibilidade
          services: {
            connect: { id: mainServiceId },
          },
        },
        include: {
          customers: true,
          services: true,
        },
      });
    });

    // 5. Notificar Profissional
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
