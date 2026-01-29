import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { parseISO, isValid, addMinutes } from "date-fns";

export class AppointmentController {
  async create(req: Request, res: Response) {
    try {
      const { professionalId, startTime, services } = req.body;
      const customerId = req.user_id; // Vem do token JWT (Autenticado)
      const tenantId = (req as any).tenant_id; // Vem do Middleware

      console.log("--- TENTATIVA DE AGENDAMENTO ---");
      console.log("Recebido:", {
        professionalId,
        startTime,
        servicesCount: services?.length,
      });

      // 1. Validações Básicas
      if (!professionalId || !startTime || !services || services.length === 0) {
        return res.status(400).json({ error: "Dados incompletos." });
      }

      // 2. Tratamento da Data
      // O frontend envia algo como "2026-01-29T14:30:00"
      const startDate = parseISO(startTime);

      if (!isValid(startDate)) {
        console.error("Data Inválida:", startTime);
        return res.status(400).json({ error: "Formato de data inválido." });
      }

      // 3. Verifica se o Cliente e o Profissional existem (Evita erro de Foreign Key)
      const customerExists = await prisma.customers.findUnique({
        where: { id: customerId },
      });
      const professionalExists = await prisma.users.findUnique({
        where: { id: professionalId },
      });

      if (!customerExists)
        return res.status(404).json({ error: "Cliente não encontrado." });
      if (!professionalExists)
        return res.status(404).json({ error: "Profissional não encontrado." });

      // 4. Criação com Transação (Calcula totais e salva)
      const appointment = await prisma.$transaction(async (tx) => {
        // A. Calcula Duração e Preço Total consultando o banco (Segurança)
        let totalDuration = 0;
        let totalPrice = 0;

        for (const s of services) {
          const serviceData = await tx.services.findUnique({
            where: { id: s.id },
          });
          if (serviceData) {
            totalDuration += serviceData.duration_minutes;
            totalPrice += Number(serviceData.price);
          }
        }

        // B. Calcula hora do término
        const endDate = addMinutes(startDate, totalDuration);

        // C. Cria o Agendamento
        // IMPORTANTE: Ajuste a parte 'services_appointments' conforme seu schema.prisma
        // Se você usa N:N explícito, use 'create'. Se for implícito, use 'connect'.
        // Abaixo assumo uma tabela de junção padrão 'services_appointments' ou similar.

        const newAppointment = await tx.appointments.create({
          data: {
            customer_id: customerId,
            professional_id: professionalId,
            tenant_id: tenantId,
            start_time: startDate, // Data Objeto JS
            end_time: endDate, // Data Objeto JS
            status: "SCHEDULED",
            total_price: totalPrice,

            // Caso 2: Se o prisma gerencia a relação automaticamente (Implicit N:N)
            services: {
              connect: services.map((s: any) => ({ id: s.id })),
            },
          },
        });

        return newAppointment;
      });

      console.log("Agendamento Criado com Sucesso ID:", appointment.id);
      return res.status(201).json(appointment);
    } catch (error) {
      console.error("ERRO CRÍTICO NO BACKEND:", error);
      // O console mostrará se for erro de chave estrangeira, sintaxe, etc.
      return res
        .status(500)
        .json({ error: "Erro interno ao processar agendamento." });
    }
  }
}
