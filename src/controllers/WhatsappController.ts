import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import {
  parseISO,
  format,
  addMinutes,
  startOfDay,
  endOfDay,
  isBefore,
} from "date-fns";

// Armazena estado temporário da conversa em memória
// Em produção, ideal usar Redis ou Banco
const conversationState: any = {};

export class WhatsappController {
  async handle(req: Request, res: Response) {
    const { Body, From } = req.body; // Webhook do Twilio/WPPConnect (ajuste conforme sua lib)

    // Normaliza telefone (remove + e caracteres)
    const phone = From.replace(/\D/g, "");

    // Se não tem estado, inicia
    if (!conversationState[phone]) {
      conversationState[phone] = { step: "WELCOME" };
    }

    const state = conversationState[phone];
    let responseMessage = "";

    try {
      // --- PASSO 0: BOAS VINDAS ---
      if (state.step === "WELCOME") {
        const professionals = await prisma.users.findMany({
          where: { role: "barber", active: true },
        });

        if (professionals.length === 0) {
          responseMessage =
            "Desculpe, não temos profissionais disponíveis no momento.";
        } else {
          responseMessage =
            "Olá! Bem-vindo à Barbearia.\nCom quem você deseja agendar?\n\n";
          professionals.forEach((p, index) => {
            responseMessage += `${index + 1} - ${p.name}\n`;
          });

          state.step = "CHOOSE_PROFESSIONAL";
          state.professionals = professionals; // Salva lista para usar no próx passo
        }
      }

      // --- PASSO 1: ESCOLHER PROFISSIONAL ---
      else if (state.step === "CHOOSE_PROFESSIONAL") {
        const choice = parseInt(Body);
        const selectedPro = state.professionals[choice - 1];

        if (!selectedPro) {
          responseMessage = "Opção inválida. Digite o número do profissional:";
        } else {
          state.proId = selectedPro.id;
          state.proName = selectedPro.name;

          // BUSCA SERVIÇOS (NOVO)
          const services = await prisma.services.findMany({
            where: { tenant_id: selectedPro.tenant_id }, // Assume que serviços são da loja
          });

          if (services.length === 0) {
            responseMessage = "Este profissional não tem serviços cadastrados.";
            delete conversationState[phone]; // Reseta
          } else {
            responseMessage = `Certo, agendar com *${selectedPro.name}*.\nQual serviço você deseja?\n\n`;
            services.forEach((s, index) => {
              responseMessage += `${index + 1} - ${s.name} (R$ ${s.price})\n`;
            });

            state.step = "CHOOSE_SERVICE"; // <--- NOVO ESTADO
            state.services = services;
          }
        }
      }

      // --- PASSO 2: ESCOLHER SERVIÇO (NOVO) ---
      else if (state.step === "CHOOSE_SERVICE") {
        const choice = parseInt(Body);
        const selectedService = state.services[choice - 1];

        if (!selectedService) {
          responseMessage = "Serviço inválido. Digite o número correspondente:";
        } else {
          state.serviceId = selectedService.id;
          state.serviceName = selectedService.name;
          state.duration = selectedService.duration_minutes;
          state.price = selectedService.price;

          // MOSTRA HORÁRIOS (Lógica simplificada para hoje/amanhã)
          // Aqui você chamaria seu ListAvailabilityService
          responseMessage = `Você escolheu: *${selectedService.name}*.\nPara qual horário hoje? (Digite no formato HH:mm, ex: 14:30)`;

          state.step = "CHOOSE_TIME";
        }
      }

      // --- PASSO 3: ESCOLHER HORÁRIO ---
      else if (state.step === "CHOOSE_TIME") {
        // Validação simples de horário
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if (!timeRegex.test(Body)) {
          responseMessage = "Formato inválido. Digite assim: 14:30 ou 09:00";
        } else {
          // Cria data de HOJE com o horário
          const now = new Date();
          const [hours, minutes] = Body.split(":");
          const appointmentDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            parseInt(hours),
            parseInt(minutes),
          );

          // Verifica se já passou
          if (isBefore(appointmentDate, new Date())) {
            responseMessage = "Esse horário já passou. Escolha outro:";
          } else {
            state.appointmentDate = appointmentDate;

            responseMessage =
              `Confirma o agendamento?\n\n` +
              `✂️ *Serviço:* ${state.serviceName}\n` +
              `💈 *Profissional:* ${state.proName}\n` +
              `🕒 *Horário:* ${format(appointmentDate, "HH:mm")}\n` +
              `💰 *Valor:* R$ ${state.price}\n\n` +
              `Digite *1* para Confirmar ou *2* para Cancelar.`;

            state.step = "CONFIRM";
          }
        }
      }

      // --- PASSO 4: CONFIRMAÇÃO ---
      else if (state.step === "CONFIRM") {
        if (Body === "1") {
          // SALVA NO BANCO
          await prisma.appointments.create({
            data: {
              start_time: state.appointmentDate,
              end_time: addMinutes(state.appointmentDate, state.duration),
              service_id: state.serviceId,
              user_id: state.proId, // O profissional que vai atender
              customer_phone: phone,
              tenant_id: "seu-tenant-id-fixo-ou-dinamico", // Ajuste conforme sua lógica de tenant
              status: "confirmed",
            },
          });

          responseMessage =
            "✅ Agendamento confirmado com sucesso! Te esperamos lá.";
          delete conversationState[phone]; // Limpa estado
        } else {
          responseMessage =
            "Agendamento cancelado. Digite Oi para começar de novo.";
          delete conversationState[phone];
        }
      }
    } catch (error) {
      console.error(error);
      responseMessage = "Ocorreu um erro. Tente novamente mais tarde.";
      delete conversationState[phone];
    }

    // Retorna XML (Twilio) ou JSON (WPPConnect/Baileys)
    // Se estiver usando WPPConnect, você enviaria a mensagem aqui via client.sendText
    // Como é um controller genérico, vou retornar JSON para teste
    return res.json({ message: responseMessage });
  }
}
