import { prisma } from "../prisma/client";
import {
  parseISO,
  startOfDay,
  endOfDay,
  getDay,
  format,
  isBefore,
  addMinutes,
} from "date-fns";

interface Request {
  date: string;
  barberId: string;
  tenantId: string;
}

export class ListAvailabilityService {
  async execute({ date, barberId, tenantId }: Request) {
    const dataSolicitada = parseISO(date);
    const diaDaSemana = getDay(dataSolicitada);

    // 1. Regra de Horário
    const regraHorario = await prisma.operating_hours.findFirst({
      where: { tenant_id: tenantId, day_of_week: diaDaSemana },
    });

    if (!regraHorario || regraHorario.is_closed) {
      return {
        dia: format(dataSolicitada, "dd/MM/yyyy"),
        horariosLivres: [],
        mensagem: "Fechado",
      };
    }

    // --- CORREÇÃO DE FUSO HORÁRIO AQUI ---
    // Em vez de 'format', usamos o toISOString para pegar o valor UTC puro (09:00)
    // O slice(11, 16) pega exatamente os caracteres "HH:mm" da string ISO
    let horaAtualStr = regraHorario.open_time.toISOString().slice(11, 16);
    let horaFimStr = regraHorario.close_time.toISOString().slice(11, 16);
    // -------------------------------------

    // 2. Buscando Ocupações
    // Para garantir que buscamos o dia certo independente do fuso, usamos start/end do dia UTC se necessário
    // Mas por enquanto, vamos manter local para simplificar a query do banco
    const startDay = startOfDay(dataSolicitada);
    const endDay = endOfDay(dataSolicitada);

    const agendamentos = await prisma.appointments.findMany({
      where: {
        professional_id: barberId,
        start_time: { gte: startDay, lte: endDay },
        status: { not: "cancelled" },
      },
    });

    const bloqueios = await prisma.blocked_slots.findMany({
      where: {
        OR: [{ user_id: barberId }, { user_id: null }],
        start_time: { gte: startDay, lte: endDay },
      },
    });

    // 3. Gerando Slots
    const slotsDisponiveis = [];

    // Criamos as datas completas combinando "2026-01-26" com "09:00"
    let cursorTempo = parseISO(`${date}T${horaAtualStr}`);
    const fimDoDia = parseISO(`${date}T${horaFimStr}`);

    const duracaoServico = 45;

    // Loop para gerar os slots
    while (isBefore(addMinutes(cursorTempo, duracaoServico), fimDoDia)) {
      const slotFim = addMinutes(cursorTempo, duracaoServico);

      // Verificação de colisão simples
      const estaOcupado =
        agendamentos.some((appt) => {
          // Ajuste fino: converter para timestamp para comparar números puros
          return (
            cursorTempo.getTime() < appt.end_time.getTime() &&
            slotFim.getTime() > appt.start_time.getTime()
          );
        }) ||
        bloqueios.some((block) => {
          return (
            cursorTempo.getTime() < block.end_time.getTime() &&
            slotFim.getTime() > block.start_time.getTime()
          );
        });

      if (!estaOcupado) {
        slotsDisponiveis.push(format(cursorTempo, "HH:mm"));
      }
      cursorTempo = addMinutes(cursorTempo, 30);
    }

    return {
      dia: format(dataSolicitada, "dd/MM/yyyy"),
      horariosLivres: slotsDisponiveis,
    };
  }
}
