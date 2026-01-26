import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hash } from "bcryptjs";

export class ProfessionalController {
  // 1. CONTRATAR
  async create(req: Request, res: Response) {
    try {
      const { name, email, password, phone } = req.body;
      const tenant_id = (req as any).tenant_id;

      if (!tenant_id) return res.status(401).json({ error: "Não autorizado" });
      if (!email || !password || !name)
        return res.status(400).json({ error: "Preencha todos os campos" });

      // Verificar se e-mail já existe
      const userExists = await prisma.users.findUnique({
        where: { email },
      });

      if (userExists) {
        return res
          .status(400)
          .json({ error: "E-mail já cadastrado no sistema." });
      }

      const passwordHash = await hash(password, 8);

      const professional = await prisma.users.create({
        data: {
          name,
          email,
          password_hash: passwordHash,
          phone: phone || "", // Garante string vazia se não vier
          role: "barber",
          tenant_id,
          active: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return res.json(professional);
    } catch (err) {
      console.error("Erro ao criar profissional:", err); // <--- LOG NO TERMINAL
      return res
        .status(500)
        .json({ error: "Erro interno ao salvar profissional" });
    }
  }

  // 2. LISTAR
  async list(req: Request, res: Response) {
    try {
      const tenant_id = (req as any).tenant_id;

      const professionals = await prisma.users.findMany({
        where: {
          tenant_id,
          role: "barber",
          active: true, // Só traz os ativos
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      });

      return res.json(professionals);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao listar equipe" });
    }
  }

  // 3. DEMITIR
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await prisma.users.update({
        where: { id },
        data: { active: false }, // Soft delete (apenas desativa)
      });
      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ error: "Erro ao deletar" });
    }
  }
}
