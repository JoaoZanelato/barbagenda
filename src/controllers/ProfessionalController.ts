import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hash } from "bcryptjs";

export class ProfessionalController {
  // 1. CONTRATAR (Criar Barbeiro)
  async create(req: Request, res: Response) {
    const { name, email, password, phone } = req.body;
    const tenant_id = (req as any).tenant_id;

    // Verificar se e-mail já existe
    const userExists = await prisma.users.findUnique({
      where: { email },
    });

    if (userExists) {
      return res
        .status(400)
        .json({ error: "E-mail já cadastrado no sistema." });
    }

    // Criptografar a senha do novo funcionário
    const passwordHash = await hash(password, 8);

    const professional = await prisma.users.create({
      data: {
        name,
        email,
        password_hash: passwordHash,
        phone,
        role: "barber", // Definimos o cargo automaticamente
        tenant_id,
      },
      select: {
        // Não devolvemos a senha no retorno por segurança
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.json(professional);
  }

  // 2. LISTAR EQUIPE (Só do meu salão)
  async list(req: Request, res: Response) {
    const tenant_id = (req as any).tenant_id;

    const professionals = await prisma.users.findMany({
      where: {
        tenant_id,
        role: "barber", // Filtra apenas funcionários, não o dono
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        active: true,
      },
    });

    return res.json(professionals);
  }

  // 3. DEMITIR (Deletar ou Desativar)
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const tenant_id = (req as any).tenant_id;

    // Garante que o funcionário é deste salão antes de deletar
    const user = await prisma.users.findFirst({
      where: { id, tenant_id },
    });

    if (!user) {
      return res.status(404).json({ error: "Funcionário não encontrado." });
    }

    await prisma.users.delete({ where: { id } });

    return res.status(204).send();
  }
}
