import cron from "node-cron";
import { prisma } from "../prisma/client";
import {
  WhatsappController,
  sessions,
} from "../controllers/WhatsappController";
import { addMinutes, startOfMinute, endOfMinute } from "date-fns";

export class CronService {
  constructor() {
    // Inicializa o agendamento
    // "*/1 * * * *" significa "Rodar a cada 1 minuto"
    cron.schedule("*/1 * * * *", async () => {
      await this.checkEndingAppointments();
    });
    console.log(
      "⏰ Cron Service iniciado (Verificando agendamentos a cada minuto)",
    );
  }

  async checkEndingAppointments() {
    const now = new Date();
    // Queremos agendamentos que terminam EXATAMENTE daqui a 5 minutos
    // Se agora é 14:00, buscamos quem termina entre 14:05:00 e 14:05:59
    const targetTime = addMinutes(now, 5);

    try {
      // Busca agendamentos que:
      // 1. Terminam no minuto alvo
      // 2. Status é 'confirmed' (não cancelado/concluído)
      // 3. Ainda não enviamos o lembrete (whatsapp_reminder_sent = false)
      const appointments = await prisma.appointments.findMany({
        where: {
          end_time: {
            gte: startOfMinute(targetTime),
            lte: endOfMinute(targetTime),
          },
          status: "confirmed",
          whatsapp_reminder_sent: false,
        },
        include: {
          users: true, // Para pegar o telefone do Barbeiro
        },
      });

      if (appointments.length === 0) return;

      const whatsapp = new WhatsappController();

      for (const app of appointments) {
        // Verifica se o barbeiro tem telefone cadastrado
        if (!app.users || !app.users.phone) continue;

        // Formata telefone (Twilio precisa do prefixo whatsapp:)
        // Removemos caracteres não numéricos primeiro
        const barberPhone = `whatsapp:${app.users.phone.replace(/\D/g, "")}`;

        // Tenta pegar o nome do cliente
        const clientName = app.customer_phone || "Cliente";

        console.log(
          `🔔 Notificando barbeiro ${app.users.name} sobre fim do corte de ${clientName}`,
        );

        // 1. Envia a pergunta
        await whatsapp.sendMessage(
          barberPhone,
          `⏳ *Finalizando Atendimento*\n\nO horário do(a) *${clientName}* está acabando.\n\nO atendimento foi realizado?\n\n*1* - Sim (Concluir)\n*2* - Não (Cliente não veio)`,
        );

        // 2. Coloca o Barbeiro no estado "CONFIRM_COMPLETION"
        // Isso faz com que a próxima mensagem dele caia naquele 'case' especial que criamos
        sessions.set(barberPhone, {
          step: "CONFIRM_COMPLETION",
          appointmentId: app.id,
        });

        // 3. Marca no banco que já avisamos (evita mandar msg duplicada)
        await prisma.appointments.update({
          where: { id: app.id },
          data: { whatsapp_reminder_sent: true },
        });
      }
    } catch (error) {
      console.error("Erro no CronService:", error);
    }
  }
}
