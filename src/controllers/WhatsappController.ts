import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import {
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
  parse,
  isValid,
  isPast,
  isSameDay,
  getHours,
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

  // --- LÓGICA DE CALCULAR HORÁRIOS LIVRES ---
  async getAvailableSlots(
    proId: string,
    tenantId: string,
    date: Date,
    totalDuration: number,
  ) {
    const dayOfWeek = getDay(date);
    const SLOT_INTERVAL = 30; // Intervalo fixo de 30 min para ficar "redondo"

    const operatingHours = await prisma.operating_hours.findMany({
      where: { tenant_id: tenantId, day_of_week: dayOfWeek },
      orderBy: { open_time: "asc" },
    });

    if (operatingHours.length === 0) return [];

    const appointments = await prisma.appointments.findMany({
      where: {
        professional_id: proId,
        start_time: { gte: startOfDay(date), lte: endOfDay(date) },
        status: { not: "canceled" },
      },
    });

    let slots: Date[] = [];
    const now = new Date();

    for (const range of operatingHours) {
      const [openHour, openMin] = range.open_time.split(":").map(Number);
      const [closeHour, closeMin] = range.close_time.split(":").map(Number);

      let currentTime = setMinutes(setHours(date, openHour), openMin);
      const rangeEndTime = setMinutes(setHours(date, closeHour), closeMin);

      while (isBefore(currentTime, rangeEndTime)) {
        const combinedEndTime = addMinutes(currentTime, totalDuration);

        if (isAfter(combinedEndTime, rangeEndTime)) break;

        const isToday = isSameDay(date, now);
        const isFutureTime = isBefore(now, currentTime);

        if (!isToday || (isToday && isFutureTime)) {
          const isBusy = appointments.some((app) => {
            const appStart = new Date(app.start_time);
            const appEnd = new Date(app.end_time);
            return (
              (currentTime >= appStart && currentTime < appEnd) ||
              (combinedEndTime > appStart && combinedEndTime <= appEnd) ||
              (currentTime <= appStart && combinedEndTime >= appEnd)
            );
          });

          if (!isBusy) {
            slots.push(new Date(currentTime));
          }
        }
        currentTime = addMinutes(currentTime, SLOT_INTERVAL);
      }
    }
    return slots;
  }

  // --- FUNÇÃO PARA FORMATAR A LISTA BONITA ---
  formatSlotsByPeriod(slots: Date[]) {
    const morning: string[] = [];
    const afternoon: string[] = [];
    const night: string[] = [];

    slots.slice(0, 18).forEach((slot, index) => {
      const hour = getHours(slot);
      // Formata: "1 - 09:00"
      // Adiciona um padding para alinhar números de 1 dígito
      const num = index + 1;
      const formatted = `*${num}* - ${format(slot, "HH:mm")}`;

      if (hour < 12) morning.push(formatted);
      else if (hour < 18) afternoon.push(formatted);
      else night.push(formatted);
    });

    let message = "";

    // Helper para montar linhas em colunas (opcional, mas fica bonito)
    const joinInPairs = (list: string[]) => {
      let result = "";
      for (let i = 0; i < list.length; i += 2) {
        const first = list[i];
        const second = list[i + 1] ? `   ${list[i + 1]}` : "";
        result += `${first}${second}\n`;
      }
      return result;
    };

    if (morning.length > 0) {
      message += `🌅 *Manhã*\n${joinInPairs(morning)}\n`;
    }
    if (afternoon.length > 0) {
      message += `☀️ *Tarde*\n${joinInPairs(afternoon)}\n`;
    }
    if (night.length > 0) {
      message += `🌙 *Noite*\n${joinInPairs(night)}\n`;
    }

    return message;
  }

  async handle(req: Request, res: Response) {
    const { Body, From, ProfileName } = req.body;
    const phone = From.replace(/\D/g, "");
    const userName = ProfileName || "Cliente";

    if (!sessions.has(From)) {
      sessions.set(From, { step: "WELCOME", selectedServices: [] });
    }

    const state = sessions.get(From);
    let responseMessage = "";

    try {
      const cmd = Body?.toLowerCase().trim();
      if (
        ["cancelar", "oi", "ola", "olá", "menu", "início", "inicio"].includes(
          cmd,
        )
      ) {
        sessions.set(From, { step: "WELCOME", selectedServices: [] });
        state.step = "WELCOME";
      }

      // --- PASSO 0: BOAS VINDAS ---
      if (state.step === "WELCOME") {
        const tenant = await prisma.tenants.findFirst();
        const shopName = tenant?.name || "Barbearia";
        const professionals = await prisma.users.findMany({
          where: { role: "barber", active: true },
        });

        if (professionals.length === 0) {
          responseMessage = `Olá, *${userName}*! 👋\nBem-vindo à *${shopName}*.\n\nNo momento não temos profissionais disponíveis. 😔`;
        } else {
          responseMessage = `Olá, *${userName}*! 👋\nSeja bem-vindo à *${shopName}*! 💈\n\nVamos agendar? Com quem você prefere cortar?\n\n`;
          professionals.forEach((p, index) => {
            responseMessage += `*${index + 1}* - ${p.name} ✂️\n`;
          });
          sessions.set(From, {
            ...state,
            step: "CHOOSE_PROFESSIONAL",
            professionals,
            selectedServices: [],
          });
        }
      }

      // --- PASSO 1: ESCOLHER PROFISSIONAL ---
      else if (state.step === "CHOOSE_PROFESSIONAL") {
        const choice = parseInt(Body);
        const selectedPro = state.professionals?.[choice - 1];

        if (!selectedPro) {
          responseMessage =
            "⚠️ *Opção inválida.*\nDigite o número do profissional.";
        } else {
          const services = await prisma.services.findMany({
            where: { tenant_id: selectedPro.tenant_id, active: true },
          });

          if (services.length === 0) {
            responseMessage =
              "Este profissional não possui serviços cadastrados.";
            sessions.delete(From);
          } else {
            responseMessage = `Show! Você escolheu *${selectedPro.name}*. 👊\n\nEscolha o serviço:\n\n`;
            services.forEach((s, index) => {
              responseMessage += `*${index + 1}* - ${s.name} (R$ ${Number(s.price).toFixed(2)})\n`;
            });

            sessions.set(From, {
              ...state,
              step: "CHOOSE_SERVICE",
              proId: selectedPro.id,
              proName: selectedPro.name,
              tenantId: selectedPro.tenant_id,
              servicesList: services,
            });
          }
        }
      }

      // --- PASSO 2: ESCOLHER SERVIÇO ---
      else if (state.step === "CHOOSE_SERVICE") {
        const choice = parseInt(Body);
        const selectedService = state.servicesList?.[choice - 1];

        if (!selectedService) {
          responseMessage =
            "⚠️ *Serviço inválido.*\nDigite o número correspondente.";
        } else {
          const currentServices = state.selectedServices || [];
          currentServices.push(selectedService);

          sessions.set(From, {
            ...state,
            selectedServices: currentServices,
            step: "ADD_MORE_SERVICES",
          });

          responseMessage = `Adicionado: *${selectedService.name}* ✅\n\nGostaria de adicionar mais algum serviço?\n\n*1* - Sim, adicionar outro\n*2* - Não, finalizar agendamento`;
        }
      }

      // --- PASSO 2.5: ADICIONAR MAIS? ---
      else if (state.step === "ADD_MORE_SERVICES") {
        if (Body === "1") {
          responseMessage = `Certo, escolha mais um serviço:\n\n`;
          state.servicesList.forEach((s: any, index: number) => {
            responseMessage += `*${index + 1}* - ${s.name} (R$ ${Number(s.price).toFixed(2)})\n`;
          });
          sessions.set(From, { ...state, step: "CHOOSE_SERVICE" });
        } else if (Body === "2") {
          const totalDuration = state.selectedServices.reduce(
            (acc: number, s: any) => acc + s.duration_minutes,
            0,
          );
          const totalPrice = state.selectedServices.reduce(
            (acc: number, s: any) => acc + Number(s.price),
            0,
          );

          responseMessage =
            `Perfeito! 👌\n` +
            `Total: *${state.selectedServices.length} serviço(s)*\n` +
            `Valor: *R$ ${totalPrice.toFixed(2)}*\n` +
            `Duração: *${totalDuration} min*\n\n` +
            `Para quando seria?\n` +
            `*1* - Hoje\n*2* - Amanhã\nOu uma data (Ex: *27/01*)`;

          sessions.set(From, {
            ...state,
            step: "CHOOSE_DATE",
            totalDuration,
            totalPrice,
          });
        } else {
          responseMessage =
            "⚠️ Opção inválida. Digite *1* para Sim ou *2* para Não.";
        }
      }

      // --- PASSO 3: ESCOLHER DATA ---
      else if (state.step === "CHOOSE_DATE") {
        let targetDate: Date;
        const input = Body?.trim();

        if (input === "1") {
          targetDate = new Date();
        } else if (input === "2") {
          targetDate = addDays(new Date(), 1);
        } else {
          const parsedDate = parse(input, "dd/MM", new Date());
          if (!isValid(parsedDate)) {
            await this.sendMessage(
              From,
              "⚠️ *Data inválida.* Digite 1, 2 ou dia/mês (Ex: 27/01).",
            );
            return res.status(200).end();
          }
          targetDate = parsedDate;
          if (
            isPast(endOfDay(targetDate)) &&
            !isSameDay(targetDate, new Date())
          ) {
            await this.sendMessage(
              From,
              "⚠️ Data passada. Escolha uma futura.",
            );
            return res.status(200).end();
          }
        }

        const dayOfWeek = getDay(targetDate);
        const isOpenToday = await prisma.operating_hours.findFirst({
          where: { tenant_id: state.tenantId, day_of_week: dayOfWeek },
        });

        if (!isOpenToday) {
          const diaSemana = format(targetDate, "EEEE", { locale: ptBR });
          await this.sendMessage(
            From,
            `🛑 *Fechado.*\nNão abrimos nas *${diaSemana}s*. Escolha outra data.`,
          );
          return res.status(200).end();
        }

        const slots = await this.getAvailableSlots(
          state.proId,
          state.tenantId,
          targetDate,
          state.totalDuration,
        );

        if (slots.length === 0) {
          responseMessage = `😔 *Agenda cheia.*\nNão temos espaço de ${state.totalDuration}min para esse dia.`;
        } else {
          const diaFormatado = format(targetDate, "dd/MM ' ('EEEE')'", {
            locale: ptBR,
          });

          // --- AQUI ENTRA A FORMATAÇÃO NOVA ---
          const formattedSlots = this.formatSlotsByPeriod(slots);

          responseMessage =
            `📅 *Horários livres para ${diaFormatado}:*\n\n` +
            formattedSlots +
            `\n👇 *Digite o número do horário:*`;

          sessions.set(From, {
            ...state,
            step: "CHOOSE_SLOT",
            availableSlots: slots,
            targetDate,
          });
        }
      }

      // --- PASSO 4: CONFIRMAR HORÁRIO ---
      else if (state.step === "CHOOSE_SLOT") {
        const choice = parseInt(Body);
        const selectedDate = state.availableSlots?.[choice - 1];

        if (!selectedDate) {
          responseMessage =
            "⚠️ *Horário inválido.* Escolha um número da lista.";
        } else {
          const dataFinal = format(new Date(selectedDate), "dd/MM 'às' HH:mm");
          const servicesNames = state.selectedServices
            .map((s: any) => s.name)
            .join(" + ");

          responseMessage =
            `📝 *Resumo do Agendamento*\n\n` +
            `💈 *Profissional:* ${state.proName}\n` +
            `✂️ *Serviços:* ${servicesNames}\n` +
            `📅 *Início:* ${dataFinal}\n` +
            `⏱️ *Duração Total:* ${state.totalDuration} min\n` +
            `💰 *Valor Total:* R$ ${state.totalPrice.toFixed(2)}\n\n` +
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
          let customer = await prisma.customers.findFirst({
            where: { phone: phone, tenant_id: state.tenantId },
          });
          if (!customer) {
            customer = await prisma.customers.create({
              data: { phone: phone, name: userName, tenant_id: state.tenantId },
            });
          }

          let currentStartTime = new Date(state.appointmentDate);

          for (const service of state.selectedServices) {
            const currentEndTime = addMinutes(
              currentStartTime,
              service.duration_minutes,
            );

            await prisma.appointments.create({
              data: {
                start_time: currentStartTime,
                end_time: currentEndTime,
                status: "confirmed",
                services: { connect: { id: service.id } },
                users: { connect: { id: state.proId } },
                customers: { connect: { id: customer.id } },
                tenants: { connect: { id: state.tenantId } },
              },
            });
            currentStartTime = currentEndTime;
          }

          responseMessage =
            "✅ *Agendamento Confirmado!*\n\nTe esperamos lá! 💈";
          sessions.delete(From);
        } else {
          responseMessage = "🚫 Cancelado. Digite *Oi* para recomeçar.";
          sessions.delete(From);
        }
      }

      // --- CRON JOB ---
      else if (state.step === "CONFIRM_COMPLETION") {
        if (Body === "1") {
          await prisma.appointments.update({
            where: { id: state.appointmentId },
            data: { status: "completed" },
          });
          responseMessage = "✅ *Show!* Concluído e faturado. 💰";
        } else if (Body === "2") {
          await prisma.appointments.update({
            where: { id: state.appointmentId },
            data: { status: "canceled" },
          });
          responseMessage = "🚫 Cancelado.";
        } else {
          await this.sendMessage(From, "Digite 1 ou 2.");
          return res.status(200).end();
        }
        sessions.delete(From);
      }

      if (responseMessage) await this.sendMessage(From, responseMessage);
    } catch (error) {
      console.error("Erro Bot:", error);
      await this.sendMessage(From, "❌ Erro. Digite *Oi* para reiniciar.");
      sessions.delete(From);
    }

    return res.status(200).end();
  }
}
