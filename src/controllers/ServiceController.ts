import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class ServiceController {
  // CRIAR SERVIÇO
  async create(req: Request, res: Response) {
    // 1. Recebe os dados (Tenta ler 'duration' OU 'duration_minutes')
    const { name, price, duration, duration_minutes, description } = req.body;

    // Define qual usar (se vier do Front Web é 'duration', se vier do App é 'duration_minutes')
    const finalDuration = duration || duration_minutes;

    const tenant_id = (req as any).tenant_id;

    // 2. VALIDAÇÃO COM LOG (Para você ver no terminal se falhar)
    if (!name || !price || !finalDuration) {
      console.log(
        "❌ Tentativa de criar serviço falhou. Dados recebidos:",
        req.body,
      );

      return res.status(400).json({
        error: "Preencha todos os campos obrigatórios (Nome, Preço e Duração).",
      });
    }

    try {
      // 3. Cria no Banco
      const service = await prisma.services.create({
        data: {
          name,
          price: Number(price),
          duration_minutes: Number(finalDuration), // Usa o valor que encontramos
          description: description || "",
          tenant_id,
          active: true,
        },
      });

      return res.json(service);
    } catch (error) {
      console.error("❌ Erro CRÍTICO ao criar serviço:", error);
      return res.status(400).json({ error: "Erro ao cadastrar serviço." });
    }
  }

  // LISTAR SERVIÇOS
  async list(req: Request, res: Response) {
    const tenant_id = (req as any).tenant_id;

    const services = await prisma.services.findMany({
      where: {
        tenant_id,
        active: true,
      },
      orderBy: { name: "asc" },
    });

    return res.json(services);
  }

  // DELETAR SERVIÇO
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const tenant_id = (req as any).tenant_id;

    const service = await prisma.services.findFirst({
      where: { id, tenant_id },
    });

    if (!service) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    await prisma.services.update({
      where: { id },
      data: { active: false },
    });

    return res.status(204).send();
  }
}
