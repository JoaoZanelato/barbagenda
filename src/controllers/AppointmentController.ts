import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { parseISO, isValid, addMinutes } from "date-fns";

export class AppointmentController {
  // 1. LISTAR (Admin/Dashboard)
  async index(req: Request, res: Response) {
    const tenant_id = (req as any).tenant_id;

    try {
      const appointments = await prisma.appointments.findMany({
        where: { tenant_id },
        include: {
          customers: { select: { name: true, phone: true } },
          users: { select: { name: true } }, // 'users' é o profissional
          services: true,
        },
        orderBy: { start_time: "desc" },
      });

      return res.json(appointments);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar agendamentos." });
    }
  }

  // 2. CRIAR (Unificado: Web Admin + Mobile App)
  async store(req: Request, res: Response) {
    try {
      let { professionalId, startTime, services, customerId, tenantId } =
        req.body;

      // Se for Admin logado, o tenant_id vem do middleware
      if ((req as any).tenant_id) {
        tenantId = (req as any).tenant_id;
      }

      console.log("--- TENTATIVA DE AGENDAMENTO ---");

      // 1. RESGATE DO TENANT (Se não veio, tenta descobrir pelo Profissional)
      if (!tenantId && professionalId) {
        const professional = await prisma.users.findUnique({
          where: { id: professionalId },
          select: { tenant_id: true },
        });
        if (professional) tenantId = professional.tenant_id;
      }

      if (!tenantId) {
        return res
          .status(400)
          .json({ error: "Barbearia (Tenant) não identificada." });
      }

      // 2. IDENTIFICAÇÃO DO CLIENTE (Mobile)
      if (!customerId && req.body.authenticatedPhone) {
        const phone = req.body.authenticatedPhone;
        const name = req.body.authenticatedName || "Cliente App";

        // Busca ou Cria o Cliente
        let customer = await prisma.customers.findFirst({
          where: { phone, tenant_id: tenantId },
        });

        if (!customer) {
          customer = await prisma.customers.create({
            data: { name, phone, tenant_id: tenantId },
          });
        }
        customerId = customer.id;
      }

      // Validações
      if (
        !professionalId ||
        !startTime ||
        !services ||
        services.length === 0 ||
        !customerId
      ) {
        return res
          .status(400)
          .json({
            error:
              "Dados incompletos. Verifique profissional, horário, serviços e cliente.",
          });
      }

      // 3. DATA
      const startDate = parseISO(startTime);
      if (!isValid(startDate)) {
        return res.status(400).json({ error: "Data inválida." });
      }

      // 4. TRANSAÇÃO (Cálculos + Criação)
      const appointment = await prisma.$transaction(async (tx) => {
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

        const endDate = addMinutes(startDate, totalDuration);

        // ✅ CORREÇÃO PRINCIPAL:
        // 1. Pegamos apenas o primeiro serviço (pois o schema é 1:N)
        // 2. Usamos 'connect' para TODAS as relações
        const mainServiceId = services[0].id;

        const newAppt = await tx.appointments.create({
          data: {
            start_time: startDate,
            end_time: endDate,
            status: "SCHEDULED",
            total_price: totalPrice,

            // 👇 SINTAXE CORRETA DO PRISMA (Connect)
            customers: { connect: { id: customerId } },
            users: { connect: { id: professionalId } },
            tenants: { connect: { id: tenantId } },
            services: { connect: { id: mainServiceId } },
          },
        });

        return newAppt;
      });

      console.log("Agendamento Criado:", appointment.id);
      return res.status(201).json(appointment);
    } catch (error) {
      console.error("ERRO CRÍTICO NO BACKEND:", error);
      return res
        .status(500)
        .json({ error: "Erro interno ao processar agendamento." });
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
