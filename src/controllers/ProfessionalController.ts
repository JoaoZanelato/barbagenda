import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hash } from "bcryptjs";

export class ProfessionalController {
  // CRIAR PROFISSIONAL
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const tenant_id = req.tenant_id;

    // Verifica se já existe
    const userExists = await prisma.users.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: "E-mail já existe." });

    const password_hash = await hash(password, 8);

    const professional = await prisma.users.create({
      data: {
        name,
        email,
        password_hash,
        tenant_id,
        role: "barber", // 👈 MUITO IMPORTANTE: Define como Barbeiro
        active: true,
      },
    });

    return res.json(professional);
  }

  // LISTAR EQUIPE (Admin vê todos)
  async list(req: Request, res: Response) {
    const tenant_id = (req as any).tenant_id;

    const pros = await prisma.users.findMany({
      where: { tenant_id },
      select: { id: true, name: true, email: true, role: true },
    });

    return res.json(pros);
  }

  // DELETAR (Soft Delete)
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    await prisma.users.update({
      where: { id },
      data: { active: false }, // Apenas desativa
    });

    return res.status(204).send();
  }
}
