import { prisma } from "../prisma/client";

interface DaySchedule {
  day_of_week: number;
  enabled: boolean;
  start_time: string;
  end_time: string;
  lunch_start?: string;
  lunch_end?: string;
}

interface Request {
  tenant_id: string;
  schedule: DaySchedule[];
}

export class UpdateAvailabilityService {
  async execute({ tenant_id, schedule }: Request) {
    if (!schedule || schedule.length === 0) {
      throw new Error("Horários inválidos.");
    }

    // Usamos transaction para garantir que tudo seja salvo ou nada
    await prisma.$transaction(async (tx) => {
      // 1. Remove horários antigos desse tenant
      await tx.operating_hours.deleteMany({
        where: { tenant_id },
      });

      // 2. Cria os novos horários
      for (const day of schedule) {
        await tx.operating_hours.create({
          data: {
            tenant_id,
            day_of_week: day.day_of_week,
            open_time: day.start_time,
            close_time: day.end_time,
            lunch_start: day.lunch_start || null,
            lunch_end: day.lunch_end || null,
            is_closed: !day.enabled,
          },
        });
      }
    });

    return { message: "Horários atualizados com sucesso" };
  }
}