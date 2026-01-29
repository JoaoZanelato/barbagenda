import { prisma } from "../prisma/client";
import {
  parseISO,
  startOfDay,
  endOfDay,
  getDay,
  format,
  isBefore,
  addMinutes,
  isSameDay,
  isAfter,
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

    let horaAtualStr = regraHorario.open_time;
    let horaFimStr = regraHorario.close_time;

    // 2. Buscando Ocupações
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

    // Converte Strings "09:00" para Objeto Date completo naquele dia
    let cursorTempo = parseISO(`${date}T${horaAtualStr}`);
    const fimDoDia = parseISO(`${date}T${horaFimStr}`);
    const agora = new Date();

    const duracaoServico = 45; // Poderia vir dinâmico do frontend se necessário

    // Loop: Enquanto (Inicio + Duração) <= Fim do Dia
    // Usamos timestamp para comparar números puros (mais seguro que isBefore/isEqual combinados)
    while (
      addMinutes(cursorTempo, duracaoServico).getTime() <= fimDoDia.getTime()
    ) {
      const slotFim = addMinutes(cursorTempo, duracaoServico);

      // Regra de Passado: Se é hoje e horário < agora, pula
      // Adicionamos 5min de tolerância
      if (
        isSameDay(dataSolicitada, agora) &&
        isBefore(addMinutes(cursorTempo, 5), agora)
      ) {
        cursorTempo = addMinutes(cursorTempo, 30);
        continue;
      }

      // Colisão
      const estaOcupado =
        agendamentos.some((appt) => {
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
