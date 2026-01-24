import { prisma } from '../prisma/client';
import { parseISO, startOfDay, endOfDay, getDay, format, isBefore, addMinutes } from 'date-fns';

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
            where: { tenant_id: tenantId, day_of_week: diaDaSemana }
        });

        if (!regraHorario || regraHorario.is_closed) {
            return { horarios: [], mensagem: "Fechado" };
        }

        // 2. Buscando Ocupações
        const startDay = startOfDay(dataSolicitada);
        const endDay = endOfDay(dataSolicitada);

        const agendamentos = await prisma.appointments.findMany({
            where: {
                professional_id: barberId,
                start_time: { gte: startDay, lte: endDay },
                status: { not: 'cancelled' }
            }
        });

        const bloqueios = await prisma.blocked_slots.findMany({
            where: {
                OR: [{ user_id: barberId }, { user_id: null }],
                start_time: { gte: startDay, lte: endDay }
            }
        });

        // 3. Gerando Slots
        const slotsDisponiveis = [];
        let horaAtualStr = format(regraHorario.open_time, 'HH:mm');
        let horaFimStr = format(regraHorario.close_time, 'HH:mm');
        
        let cursorTempo = parseISO(`${date}T${horaAtualStr}`);
        const fimDoDia = parseISO(`${date}T${horaFimStr}`);
        const duracaoServico = 45; // TODO: Parametrizar isso depois

        while (isBefore(addMinutes(cursorTempo, duracaoServico), fimDoDia)) {
            const slotFim = addMinutes(cursorTempo, duracaoServico);
            
            const estaOcupado = 
                agendamentos.some(appt => (cursorTempo < appt.end_time && slotFim > appt.start_time)) || 
                bloqueios.some(block => (cursorTempo < block.end_time && slotFim > block.start_time));

            if (!estaOcupado) {
                slotsDisponiveis.push(format(cursorTempo, 'HH:mm'));
            }
            cursorTempo = addMinutes(cursorTempo, 30);
        }

        return { 
            dia: format(dataSolicitada, 'dd/MM/yyyy'), 
            horariosLivres: slotsDisponiveis 
        };
    }
}