import { Request, Response } from "express";
import twilio from "twilio";
import { ListAvailabilityService } from "../services/ListAvailabilityService";
import { CreateAppointmentService } from "../services/CreateAppointmentService";
import { prisma } from "../prisma/client";
import {
  addDays,
  format,
  parseISO,
  setHours,
  setMinutes,
  isValid,
} from "date-fns";

// ==========================================
// 🧠 MEMÓRIA DO BOT (Estado da Conversa)
// ==========================================
// Armazena onde cada cliente parou.
// Ex: '5541999...' => { step: 'ESCOLHER_PROFISSIONAL', barberId: '...' }
const sessions = new Map<string, any>();

export class WhatsappController {
  private accountSid = process.env.TWILIO_ACCOUNT_SID || "";
  private authToken = process.env.TWILIO_AUTH_TOKEN || "";
  private twilioNumber =
    process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";
  private client = twilio(this.accountSid, this.authToken);

  async receive(req: Request, res: Response) {
    const from = req.body.From; // whatsapp:+55...
    const body = req.body.Body.trim();
    const profileName = req.body.ProfileName || "Cliente";

    // ID DA BARBEARIA (Fixo para MVP, depois vem do banco pelo número do bot)
    const TENANT_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

    console.log(`📩 Mensagem de ${from}: ${body}`);

    try {
      // 1. Recupera ou Cria a Sessão do Usuário
      let session = sessions.get(from) || { step: "MENU_INICIAL" };

      // ============================================================
      // 🔄 COMANDO DE RESET (Para cancelar e voltar ao inicio)
      // ============================================================
      if (body.toLowerCase() === "cancelar" || body.toLowerCase() === "oi") {
        session = { step: "MENU_INICIAL" };
        sessions.set(from, session);
      }

      // ============================================================
      // 🤖 MÁQUINA DE ESTADOS
      // ============================================================

      switch (session.step) {
        // ----------------------------------------------------------
        // PASSO 0: BOAS VINDAS -> MOSTRA BARBEIROS
        // ----------------------------------------------------------
        case "MENU_INICIAL": {
          // Busca todos os barbeiros/donos do banco
          const barbers = await prisma.users.findMany({
            where: { tenant_id: TENANT_ID, active: true },
            select: { id: true, name: true },
          });

          if (barbers.length === 0) {
            await this.sendMessage(
              from,
              "🚫 Nenhum profissional disponível no momento.",
            );
            break;
          }

          // Monta a lista bonitinha
          let msg = `Olá ${profileName}! 👋 Bem-vindo à Barbearia.\n\n*Com quem você deseja cortar?*\n\n`;
          barbers.forEach((b, index) => {
            msg += `${index + 1} - ${b.name}\n`;
          });
          msg += `\nDigite o *número* da sua escolha.`;

          // Atualiza o estado para esperar a resposta
          sessions.set(from, { step: "ESCOLHER_BARBEIRO", options: barbers });
          await this.sendMessage(from, msg);
          break;
        }

        // ----------------------------------------------------------
        // PASSO 1: ESCOLHER BARBEIRO -> PEDE DATA
        // ----------------------------------------------------------
        case "ESCOLHER_BARBEIRO": {
          const escolha = parseInt(body);
          const barbers = session.options;

          if (isNaN(escolha) || escolha < 1 || escolha > barbers.length) {
            await this.sendMessage(
              from,
              "❌ Opção inválida. Digite apenas o NÚMERO do profissional.",
            );
            break;
          }

          const selectedBarber = barbers[escolha - 1];

          // Salva o ID do barbeiro na memória e avança
          sessions.set(from, {
            step: "ESCOLHER_DATA",
            barberId: selectedBarber.id,
            barberName: selectedBarber.name,
          });

          await this.sendMessage(
            from,
            `Ótima escolha! Você vai cortar com *${selectedBarber.name}*. ✂️\n\nQual dia você prefere?\n\n👉 *Hoje*\n👉 *Amanhã*\n👉 Ou digite uma data (ex: 30/01)`,
          );
          break;
        }

        // ----------------------------------------------------------
        // PASSO 2: ESCOLHER DATA -> MOSTRA HORÁRIOS
        // ----------------------------------------------------------
        case "ESCOLHER_DATA": {
          let dataBusca = new Date();
          const texto = body.toLowerCase();

          // Lógica simples de data
          if (texto.includes("amanha") || texto.includes("amanhã")) {
            dataBusca = addDays(new Date(), 1);
          } else if (texto.includes("hoje")) {
            dataBusca = new Date();
          } else {
            // Tenta ler data DD/MM (Ex: 25/01)
            const partes = texto.split("/");
            if (partes.length >= 2) {
              const ano = new Date().getFullYear();
              dataBusca = new Date(
                ano,
                parseInt(partes[1]) - 1,
                parseInt(partes[0]),
              );
            }
          }

          if (!isValid(dataBusca)) {
            await this.sendMessage(
              from,
              "Não entendi a data. 😕 Tente *Hoje*, *Amanhã* ou algo como *25/01*.",
            );
            break;
          }

          const dataFormatada = format(dataBusca, "yyyy-MM-dd");

          // Busca Disponibilidade usando o ID DO BARBEIRO DA SESSÃO
          await this.sendMessage(from, "🔄 Verificando agenda...");

          const listService = new ListAvailabilityService();
          const result = await listService.execute({
            tenantId: TENANT_ID,
            barberId: session.barberId, // <--- O PULO DO GATO AQUI 🐈
            date: dataFormatada,
          });

          if (result.horariosLivres.length > 0) {
            const lista = result.horariosLivres
              .map((h: string) => `• ${h}`)
              .join("\n");

            // Atualiza sessão com a data escolhida
            sessions.set(from, {
              ...session,
              step: "ESCOLHER_HORARIO",
              dateStr: dataFormatada,
            });

            await this.sendMessage(
              from,
              `📅 *Horários livres para ${result.dia} com ${session.barberName}:*\n\n${lista}\n\n👇 Digite o horário para agendar (Ex: 14:00)`,
            );
          } else {
            await this.sendMessage(
              from,
              `🚫 Poxa, o ${session.barberName} não tem horários livres neste dia.\n\nTente outra data ou digite *cancelar* para mudar de barbeiro.`,
            );
            // Mantém no mesmo passo para tentar outra data
          }
          break;
        }

        // ----------------------------------------------------------
        // PASSO 3: ESCOLHER HORÁRIO -> CONFIRMA AGENDAMENTO
        // ----------------------------------------------------------
        case "ESCOLHER_HORARIO": {
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (!timeRegex.test(body)) {
            await this.sendMessage(
              from,
              "❌ Horário inválido. Digite no formato HH:MM (ex: 14:30).",
            );
            break;
          }

          const [hora, minuto] = body.split(":").map(Number);
          const dataFinal = parseISO(`${session.dateStr}T00:00:00`);
          const dataComHora = setMinutes(setHours(dataFinal, hora), minuto);
          const startTimeISO = format(dataComHora, "yyyy-MM-dd'T'HH:mm:00");

          // Busca um serviço padrão (Futuramente perguntamos qual serviço tbm)
          const servico = await prisma.services.findFirst({
            where: { tenant_id: TENANT_ID },
          });

          // CRIA O AGENDAMENTO FINAL
          try {
            const createService = new CreateAppointmentService();
            await createService.execute({
              tenantId: TENANT_ID,
              professionalId: session.barberId, // ID recuperado da memória
              serviceId: servico?.id || "",
              customerName: profileName,
              customerPhone: from.replace("whatsapp:", ""),
              startTime: startTimeISO,
            });

            await this.sendMessage(
              from,
              `✅ *Agendamento Confirmado!* \n\n✂️ Profissional: ${session.barberName}\n📅 Data: ${format(dataComHora, "dd/MM")}\n⏰ Horário: ${body}\n\nTe esperamos lá!`,
            );

            // Limpa a sessão (Fim da conversa)
            sessions.delete(from);
          } catch (err) {
            console.error(err);
            await this.sendMessage(
              from,
              "❌ Ops, alguém acabou de pegar esse horário! Tente outro.",
            );
          }
          break;
        }
      }

      res.type("text/xml").send("<Response></Response>");
    } catch (error) {
      console.error("❌ Erro Bot:", error);
      res.status(500).send();
    }
  }

  async sendMessage(to: string, message: string) {
    try {
      await this.client.messages.create({
        body: message,
        from: this.twilioNumber,
        to,
      });
    } catch (e) {
      console.error("Erro ao enviar mensagem Twilio", e);
    }
  }
}
