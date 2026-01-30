import cron from "node-cron";
import { prisma } from "../prisma/client";
import { NotificationService } from "./NotificationService";
import { addMinutes, subMinutes, format } from "date-fns";

const notificationService = new NotificationService();

export class CronService {
  constructor() {
    // Configurado para rodar a cada 1 minuto
    // Se quiser testar rápido, pode mudar a lógica das datas abaixo
    cron.schedule("* * * * *", async () => {
      console.log("[CRON] Verificando lembretes...");
      await this.sendReminders();
      await this.sendPostAppointmentActions();
    });

    console.log("[CRON] Serviço de agendamento iniciado 🕒");
  }

  // 1. LEMBRETES (Avisa 1 Hora Antes)
  async sendReminders() {
    try {
      const now = new Date();
      // Define o alvo: Daqui a 60 minutos
      const oneHourFromNow = addMinutes(now, 60);
      // Janela de segurança de 5 min (caso o cron atrase um pouco)
      const timeWindowEnd = addMinutes(oneHourFromNow, 5);

      const upcoming = await prisma.appointments.findMany({
        where: {
          start_time: {
            gte: oneHourFromNow,
            lte: timeWindowEnd,
          },
          status: "SCHEDULED",
          reminder_sent: false, // Só quem ainda não recebeu
        },
        include: {
          users: { select: { push_token: true, name: true } },
          customers: { select: { name: true, phone: true } },
        },
      });

      if (upcoming.length > 0) {
        console.log(`[CRON] Enviando ${upcoming.length} lembretes.`);
      }

      for (const appt of upcoming) {
        // A. Avisar Barbeiro
        if (appt.users?.push_token) {
          await notificationService.send(
            appt.users.push_token,
            "⏰ Próximo Cliente",
            `${appt.customers?.name || "Cliente"} às ${format(appt.start_time, "HH:mm")}.`,
          );
        }

        // B. Avisar Cliente
        if (appt.customers?.phone) {
          const appClient = await prisma.app_clients.findUnique({
            where: { phone: appt.customers.phone },
            select: { push_token: true, name: true },
          });

          if (appClient?.push_token) {
            await notificationService.send(
              appClient.push_token,
              "⏰ Lembrete de Corte",
              `Olá ${appClient.name}, seu horário é daqui a pouco, às ${format(appt.start_time, "HH:mm")}.`,
            );
          }
        }

        // Marca como enviado para não repetir
        await prisma.appointments.update({
          where: { id: appt.id },
          data: { reminder_sent: true },
        });
      }
    } catch (error) {
      console.error("[CRON ERROR] Falha ao enviar lembretes:", error);
    }
  }

  // 2. PÓS-TÉRMINO (Avisa 15 Minutos após acabar)
  async sendPostAppointmentActions() {
    try {
      const now = new Date();
      // Define o alvo: Passou 15 minutos do fim
      const fifteenMinsAgo = subMinutes(now, 15);
      const timeWindowStart = subMinutes(fifteenMinsAgo, 5);

      const finished = await prisma.appointments.findMany({
        where: {
          end_time: {
            gte: timeWindowStart,
            lte: fifteenMinsAgo,
          },
          status: "SCHEDULED", // Ainda não foi finalizado no sistema
          feedback_sent: false,
        },
        include: {
          users: { select: { push_token: true } },
          customers: { select: { name: true, phone: true } },
        },
      });

      for (const appt of finished) {
        // A. Barbeiro: Pedir Confirmação
        if (appt.users?.push_token) {
          await notificationService.send(
            appt.users.push_token,
            "✅ Finalizar Atendimento",
            `O corte de ${appt.customers?.name} foi concluído? Toque para confirmar.`,
            { type: "CONFIRM_APPOINTMENT", appointmentId: appt.id },
          );
        }

        // B. Cliente: Pedir Feedback
        if (appt.customers?.phone) {
          const appClient = await prisma.app_clients.findUnique({
            where: { phone: appt.customers.phone },
            select: { push_token: true, name: true },
          });

          if (appClient?.push_token) {
            await notificationService.send(
              appClient.push_token,
              "✂️ Curtiu o visual?",
              `E aí ${appClient.name}, conta pra gente o que achou!`,
              { type: "GIVE_FEEDBACK", appointmentId: appt.id },
            );
          }
        }

        await prisma.appointments.update({
          where: { id: appt.id },
          data: { feedback_sent: true },
        });
      }
    } catch (error) {
      console.error("[CRON ERROR] Falha no pós-agendamento:", error);
    }
  }
}
