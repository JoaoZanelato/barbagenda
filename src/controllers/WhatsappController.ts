import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import {
  parseISO,
  format,
  addMinutes,
  addDays,
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  isBefore,
  isAfter,
  getDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import twilio from "twilio";

export const sessions = new Map<string, any>();

export class WhatsappController {
  private accountSid = process.env.TWILIO_ACCOUNT_SID;
  private authToken = process.env.TWILIO_AUTH_TOKEN;
  private twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER;
  private client = twilio(this.accountSid, this.authToken);

  async sendMessage(to: string, message: string) {
    try {
      await this.client.messages.create({
        body: message,
        from: this.twilioNumber,
        to: to,
      });
    } catch (error) {
      console.error("Erro Twilio:", error);
    }
  }

  // --- 🧠 O CÉREBRO DO HORÁRIO ---
  async getAvailableSlots(
    proId: string,
    tenantId: string,
    date: Date,
    duration: number,
  ) {
    const dayOfWeek = getDay(date); // 0 (Domingo) a 6 (Sábado)

    // 1. Busca os Horários de Funcionamento da Barbearia para esse dia
    const operatingHours = await prisma.operatingHours.findMany({
      where: {
        tenant_id: tenantId,
        day_of_week: dayOfWeek,
      },
      orderBy: { open_time: "asc" },
    });

    // Se não tem horário cadastrado para hoje, está FECHADO
    if (operatingHours.length === 0) return [];

    // 2. Busca agendamentos já ocupados nesse dia
    const appointments = await prisma.appointments.findMany({
      where: {
        user_id: proId,
        start_time: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        status: { not: "canceled" },
      },
    });

    let slots: Date[] = [];
    const now = new Date();

    // 3. Para cada intervalo de funcionamento (ex: Manhã e Tarde)
    for (const range of operatingHours) {
      // Converte string "08:00" para Date
      const [openHour, openMin] = range.open_time.split(":").map(Number);
      const [closeHour, closeMin] = range.close_time.split(":").map(Number);

      let currentTime = setMinutes(setHours(date, openHour), openMin);
      const rangeEndTime = setMinutes(setHours(date, closeHour), closeMin);

      // Loop gerando horários dentro desse intervalo
      while (isBefore(currentTime, rangeEndTime)) {
        // O horário de fim do serviço não pode estourar o fechamento
        const slotEnd = addMinutes(currentTime, duration);

        if (isAfter(slotEnd, rangeEndTime)) {
          break; // Não cabe mais serviços neste turno
        }

        // Verifica se é futuro (não pode agendar 10:00 se já são 11:00)
        if (isAfter(currentTime, now)) {
          // Verifica colisão com agendamentos existentes
          const isBusy = appointments.some((app) => {
            const appStart = new Date(app.start_time);
            const appEnd = new Date(app.end_time);

            // Lógica de colisão
            return (
              (currentTime >= appStart && currentTime < appEnd) || // Começa durante
              (slotEnd > appStart && slotEnd <= appEnd) // Termina durante
            );
          });

          if (!isBusy) {
            slots.push(new Date(currentTime));
          }
        }

        // Próximo horário
        currentTime = addMinutes(currentTime, duration);
      }
    }

    return slots;
  }

  async handle(req: Request, res: Response) {
    const { Body, From } = req.body;
    const phone = From.replace(/\D/g, "");

    if (!sessions.has(From)) {
      sessions.set(From, { step: "WELCOME" });
    }

    const state = sessions.get(From);
    let responseMessage = "";

    try {
      if (
        Body?.toLowerCase() === "cancelar" ||
        Body?.toLowerCase() === "oi" ||
        Body?.toLowerCase() === "menu"
      ) {
        sessions.set(From, { step: "WELCOME" });
        state.step = "WELCOME";
      }

      // --- PASSO 0: BOAS VINDAS ---
      if (state.step === "WELCOME") {
        const professionals = await prisma.users.findMany({
          where: { role: "barber", active: true },
        });

        if (professionals.length === 0) {
          responseMessage =
            "🚫 Nossos barbeiros estão indisponíveis no momento.";
        } else {
          responseMessage = "👋 Olá! Bem-vindo.\nCom quem deseja cortar?\n\n";
          professionals.forEach((p, index) => {
            responseMessage += `${index + 1} - ${p.name}\n`;
          });
          sessions.set(From, {
            ...state,
            step: "CHOOSE_PROFESSIONAL",
            professionals,
          });
        }
      }

      // --- PASSO 1: ESCOLHER PROFISSIONAL ---
      else if (state.step === "CHOOSE_PROFESSIONAL") {
        const choice = parseInt(Body);
        const selectedPro = state.professionals?.[choice - 1];

        if (!selectedPro) {
          responseMessage =
            "⚠️ Opção inválida. Digite o número do profissional:";
        } else {
          const services = await prisma.services.findMany({
            where: { tenant_id: selectedPro.tenant_id },
          });

          if (services.length === 0) {
            responseMessage =
              "Este profissional não tem serviços configurados.";
            sessions.delete(From);
          } else {
            responseMessage = `💈 *${selectedPro.name}*\nEscolha o serviço:\n\n`;
            services.forEach((s, index) => {
              responseMessage += `${index + 1} - ${s.name} (R$ ${s.price})\n`;
            });

            sessions.set(From, {
              ...state,
              step: "CHOOSE_SERVICE",
              proId: selectedPro.id,
              proName: selectedPro.name,
              tenantId: selectedPro.tenant_id, // Salva o Tenant ID
              services,
            });
          }
        }
      }

      // --- PASSO 2: ESCOLHER SERVIÇO ---
      else if (state.step === "CHOOSE_SERVICE") {
        const choice = parseInt(Body);
        const selectedService = state.services?.[choice - 1];

        if (!selectedService) {
          responseMessage = "⚠️ Número inválido. Tente novamente:";
        } else {
          responseMessage = `🗓️ *Para quando?*\n\n1 - Hoje\n2 - Amanhã\n3 - Depois de amanhã`;

          sessions.set(From, {
            ...state,
            step: "CHOOSE_DATE",
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            duration: selectedService.duration_minutes,
            price: selectedService.price,
          });
        }
      }

      // --- PASSO 3: ESCOLHER DATA E LISTAR HORÁRIOS ---
      else if (state.step === "CHOOSE_DATE") {
        let targetDate = new Date();
        const choice = Body;

        if (choice === "1") {
          /* Hoje */
        } else if (choice === "2") {
          targetDate = addDays(targetDate, 1);
        } else if (choice === "3") {
          targetDate = addDays(targetDate, 2);
        } else {
          responseMessage = "⚠️ Opção inválida. Digite 1, 2 ou 3.";
          await this.sendMessage(From, responseMessage);
          return res.status(200).end();
        }

        // CHAMA A LÓGICA DE HORÁRIOS
        const slots = await this.getAvailableSlots(
          state.proId,
          state.tenantId,
          targetDate,
          state.duration,
        );

        if (slots.length === 0) {
          const diaSemana = format(targetDate, "EEEE", { locale: ptBR });
          responseMessage = `😔 Sem horários disponíveis para ${diaSemana}. Tente outro dia (Digite Oi).`;
          sessions.delete(From);
        } else {
          responseMessage = `🕒 *Horários para ${format(targetDate, "dd/MM")}*\n\n`;

          // Mostra no máximo 15 horários para não poluir
          slots.slice(0, 15).forEach((slot, index) => {
            responseMessage += `${index + 1} - ${format(slot, "HH:mm")}\n`;
          });
          responseMessage += `\nDigite o número do horário:`;

          sessions.set(From, {
            ...state,
            step: "CHOOSE_SLOT",
            availableSlots: slots,
          });
        }
      }

      // --- PASSO 4: CONFIRMAÇÃO ---
      else if (state.step === "CHOOSE_SLOT") {
        const choice = parseInt(Body);
        const selectedDate = state.availableSlots?.[choice - 1];

        if (!selectedDate) {
          responseMessage = "⚠️ Horário inválido.";
        } else {
          responseMessage =
            `📝 *Resumo do Agendamento*\n\n` +
            `💈 ${state.proName}\n` +
            `✂️ ${state.serviceName}\n` +
            `📅 ${format(new Date(selectedDate), "dd/MM 'às' HH:mm")}\n` +
            `💰 R$ ${state.price}\n\n` +
            `Digite *1* para CONFIRMAR ✅\nDigite *2* para CANCELAR ❌`;

          sessions.set(From, {
            ...state,
            step: "CONFIRM_FINAL",
            appointmentDate: selectedDate,
          });
        }
      }

      // --- PASSO 5: FINALIZAR ---
      else if (state.step === "CONFIRM_FINAL") {
        if (Body === "1") {
          // Busca ou Cria Cliente
          let customer = await prisma.customers.findFirst({
            where: { phone: phone, tenant_id: state.tenantId },
          });

          if (!customer) {
            customer = await prisma.customers.create({
              data: {
                phone: phone,
                name: "Cliente WhatsApp",
                tenant_id: state.tenantId,
              },
            });
          }

          // Cria Agendamento
          await prisma.appointments.create({
            data: {
              start_time: new Date(state.appointmentDate),
              end_time: addMinutes(
                new Date(state.appointmentDate),
                state.duration,
              ),
              status: "confirmed",
              services: { connect: { id: state.serviceId } },
              users: { connect: { id: state.proId } },
              customers: { connect: { id: customer.id } },
              tenants: { connect: { id: state.tenantId } },
            },
          });

          responseMessage = "✅ Agendamento Confirmado! Obrigado.";
          sessions.delete(From);
        } else {
          responseMessage = "🚫 Agendamento cancelado.";
          sessions.delete(From);
        }
      }

      // LÓGICA DO CRON (Confirmação Barbeiro) MANTIDA
      else if (state.step === "CONFIRM_COMPLETION") {
        if (Body === "1") {
          await prisma.appointments.update({
            where: { id: state.appointmentId },
            data: { status: "completed" },
          });
          responseMessage = "✅ Concluído!";
        } else if (Body === "2") {
          await prisma.appointments.update({
            where: { id: state.appointmentId },
            data: { status: "canceled" },
          });
          responseMessage = "🚫 Cancelado!";
        } else {
          responseMessage = "Responda 1 ou 2.";
          await this.sendMessage(From, responseMessage);
          return res.status(200).end();
        }
        sessions.delete(From);
      }

      if (responseMessage) await this.sendMessage(From, responseMessage);
    } catch (error) {
      console.error("Erro Bot:", error);
      await this.sendMessage(From, "Erro no sistema. Digite Oi.");
      sessions.delete(From);
    }

    return res.status(200).end();
  }
}
