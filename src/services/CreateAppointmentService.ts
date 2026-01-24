import { prisma } from '../prisma/client';
import { parseISO, addMinutes } from 'date-fns';

interface Request {
    tenantId: string;
    professionalId: string;
    serviceId: string;
    customerName: string;
    customerPhone: string;
    startTime: string;
}

export class CreateAppointmentService {
    async execute({ tenantId, professionalId, serviceId, customerName, customerPhone, startTime }: Request) {
        // 1. Upsert Cliente
        let customer = await prisma.customers.findFirst({
            where: { phone: customerPhone, tenant_id: tenantId }
        });

        if (!customer) {
            customer = await prisma.customers.create({
                data: { tenant_id: tenantId, name: customerName, phone: customerPhone }
            });
        }

        // 2. Validar Serviço
        const service = await prisma.services.findUnique({ where: { id: serviceId } });
        if (!service) throw new Error("Serviço inválido");

        // 3. Calcular Data Fim
        const dataInicio = parseISO(startTime);
        const dataFim = addMinutes(dataInicio, service.duration_minutes);

        // 4. Criar Agendamento
        const agendamento = await prisma.appointments.create({
            data: {
                tenant_id: tenantId,
                professional_id: professionalId,
                customer_id: customer.id,
                service_id: serviceId,
                start_time: dataInicio,
                end_time: dataFim,
                status: 'confirmed'
            }
        });

        return agendamento;
    }
}