import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { startOfDay, endOfDay } from "date-fns";

export class DashboardController {
  async index(req: Request, res: Response) {
    const tenant_id = (req as any).tenant_id;
    const today = new Date();

    // Busca agendamentos de HOJE (00:00 até 23:59)
    const appointments = await prisma.appointments.findMany({
      where: {
        tenant_id,
        start_time: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
      include: {
        service: true, // Precisamos do serviço para saber o preço
      },
    });

    // Calcula os totais
    const count = appointments.length;
    const income = appointments.reduce((total, app) => {
      return total + Number(app.service.price);
    }, 0);

    return res.json({
      todayCount: count,
      todayIncome: income,
    });
  }
}
