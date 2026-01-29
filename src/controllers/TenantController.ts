import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hash } from "bcryptjs";

export class TenantController {
  // 1. LISTAR (Para o seu Painel Super-Admin ver todas)
  async index(req: Request, res: Response) {
    try {
      const tenants = await prisma.tenants.findMany({
        orderBy: { created_at: "desc" },
        include: {
          _count: {
            select: { users: true, customers: true, appointments: true },
          },
        },
      });
      return res.json(tenants);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar barbearias" });
    }
  }

  // 2. CRIAR NOVA BARBEARIA (Signup)
  async store(req: Request, res: Response) {
    try {
      const { name, slug, userName, email, password, phone } = req.body;

      // Validações
      if (!name || !slug || !userName || !email || !password) {
        return res.status(400).json({ error: "Faltam dados obrigatórios." });
      }

      // Verifica duplicidade de Slug
      const slugExists = await prisma.tenants.findUnique({ where: { slug } });
      if (slugExists) {
        return res
          .status(400)
          .json({ error: "Este link (slug) já está em uso." });
      }

      // Verifica duplicidade de Email
      const emailExists = await prisma.users.findUnique({ where: { email } });
      if (emailExists) {
        return res
          .status(400)
          .json({ error: "Este e-mail já está cadastrado." });
      }

      // Criptografa senha
      const passwordHash = await hash(password, 8);

      // CRIAÇÃO ATÔMICA (Barbearia + Dono)
      // Usamos 'create' no tenant e 'create' nos users aninhado
      const tenant = await prisma.tenants.create({
        data: {
          name,
          slug,
          plan_status: "active", // Ou 'trial'
          users: {
            create: {
              name: userName,
              email,
              phone,
              password_hash: passwordHash,
              role: "admin", // O primeiro usuário é Admin
            },
          },
          // Cria horários padrão para não começar zerado
          operating_hours: {
            createMany: {
              data: [
                { day_of_week: 1, open_time: "09:00", close_time: "19:00" }, // Seg
                { day_of_week: 2, open_time: "09:00", close_time: "19:00" }, // Ter
                { day_of_week: 3, open_time: "09:00", close_time: "19:00" }, // Qua
                { day_of_week: 4, open_time: "09:00", close_time: "19:00" }, // Qui
                { day_of_week: 5, open_time: "09:00", close_time: "19:00" }, // Sex
                { day_of_week: 6, open_time: "09:00", close_time: "18:00" }, // Sab
              ],
            },
          },
        },
      });

      return res.status(201).json(tenant);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar barbearia." });
    }
  }
}
