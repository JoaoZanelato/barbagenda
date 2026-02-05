import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hash } from "bcryptjs";

export class ProfessionalController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;
    // 👇 Garante ID
    const tenant_id = req.tenant_id || (req.user && req.user.tenant_id);

    const userExists = await prisma.users.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: "E-mail já existe." });

    const password_hash = await hash(password, 8);

    const professional = await prisma.users.create({
      data: {
        name,
        email,
        password_hash,
        tenant_id,
        role: "barber",
        active: true,
      },
    });

    return res.json(professional);
  }

  async list(req: Request, res: Response) {
    const tenant_id = req.tenant_id || (req.user && req.user.tenant_id);
    const user_id = req.user?.id; // ID do usuário logado (Admin)

    const pros = await prisma.users.findMany({
      where: {
        tenant_id,
        active: true,
        id: { not: user_id }, // 👈 FILTRO: Remove o próprio admin da lista
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return res.json(pros);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await prisma.users.update({ where: { id }, data: { active: false } });
    return res.status(204).send();
  }
}
