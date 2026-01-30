import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { startOfDay, endOfDay } from "date-fns";

export class DashboardController {
  async index(req: Request, res: Response) {
    try {
      const tenant_id = req.tenant_id;

      const today = new Date();

      // Busca agendamentos de HOJE
      const appointments = await prisma.appointments.findMany({
        where: {
          tenant_id,
          start_time: {
            gte: startOfDay(today),
            lte: endOfDay(today),
          },
        },
        include: {
          services: true, // Importante: usar 'services' no plural (padrão do Prisma)
        },
      });

      // Contagem: Exclui cancelados
      const count = appointments.filter((a) => a.status !== "canceled").length;

      let estimated = 0;
      let confirmed = 0;

      appointments.forEach((app) => {
        // Se o serviço foi deletado, considera preço 0
        const price = app.services ? Number(app.services.price) : 0;

        // Se cancelado, ignora
        if (app.status === "canceled") return;

        // 1. ESTIMADO: Soma tudo que está na agenda (Agendado, Confirmado ou Concluído)
        estimated += price;

        // 2. CONFIRMADO (Caixa Real): Soma APENAS o que foi 'completed' (Concluído)
        if (app.status === "completed") {
          confirmed += price;
        }
      });

      return res.json({
        todayCount: count,
        estimatedIncome: estimated,
        confirmedIncome: confirmed,
      });
    } catch (error) {
      console.error("Erro no DashboardController:", error);
      return res.status(500).json({ error: "Erro interno ao buscar métricas" });
    }
  }
}
