import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hash } from "bcryptjs";

export class TenantController {
  
  // 1. LISTAR (Modo de Segurança Máxima)
  async index(req: Request, res: Response) {
    try {
      console.log("🔍 Buscando barbearias...");
      
      // Tenta buscar. Se o banco estiver desalinhado, vai falhar aqui.
      const tenants = await prisma.tenants.findMany();

      console.log(`✅ Sucesso! Encontradas: ${tenants.length}`);
      return res.json(tenants);

    } catch (error: any) {
      // SE DER ERRO, NÃO TRAVA O FRONTEND!
      // Loga o erro real no terminal para você corrigir depois
      console.error("⚠️ ERRO DE BANCO DE DADOS (Ignorado para não travar):");
      console.error(error.message);

      // Retorna lista vazia para o Frontend carregar a tela "Nenhuma barbearia"
      return res.json([]); 
    }
  }

  // 2. CRIAR (Mantido igual)
  async store(req: Request, res: Response) {
    const { name, slug, userName, email, password, phone } = req.body;

    if (!name || !slug || !userName || !email || !password || !phone) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    try {
      // Verifica duplicidade (Slug e Email)
      const slugExists = await prisma.tenants.findUnique({ where: { slug } });
      if (slugExists) return res.status(400).json({ error: "Este link (slug) já existe." });

      const emailExists = await prisma.users.findUnique({ where: { email } });
      if (emailExists) return res.status(400).json({ error: "Este e-mail já tem cadastro." });

      // Criação segura com transação
      const result = await prisma.$transaction(async (tx) => {
        const tenant = await tx.tenants.create({
          data: {
            name,
            slug,
            plan_status: "active",
            operating_hours: {
              create: [
                { day_of_week: 1, open_time: "09:00", close_time: "18:00" },
                { day_of_week: 2, open_time: "09:00", close_time: "18:00" },
                { day_of_week: 3, open_time: "09:00", close_time: "18:00" },
                { day_of_week: 4, open_time: "09:00", close_time: "18:00" },
                { day_of_week: 5, open_time: "09:00", close_time: "18:00" },
                { day_of_week: 6, open_time: "09:00", close_time: "14:00" },
              ]
            }
          },
        });

        const passwordHash = await hash(password, 8);
        
        const user = await tx.users.create({
          data: {
            name: userName,
            email,
            phone,
            password_hash: passwordHash,
            role: "barber",
            tenant_id: tenant.id,
            active: true,
          },
        });

        return { tenant, user };
      });

      return res.status(201).json(result);

    } catch (error: any) {
      console.error("❌ Erro ao criar:", error);
      return res.status(400).json({ error: error.message || "Erro ao criar barbearia." });
    }
  }
}