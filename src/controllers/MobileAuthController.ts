import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export class MobileAuthController {
  async register(req: Request, res: Response) {
    const { name, phone, pin } = req.body;

    if (!name || !phone || !pin) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    if (String(pin).length !== 4) {
      return res.status(400).json({ error: "O PIN deve ter 4 dígitos." });
    }

    try {
      const userExists = await prisma.app_clients.findUnique({
        where: { phone },
      });
      if (userExists) {
        return res.status(400).json({ error: "Telefone já cadastrado." });
      }

      const pinHash = await hash(String(pin), 8);

      const user = await prisma.app_clients.create({
        data: { name, phone, pin_hash: pinHash },
      });

      const token = sign(
        { phone: user.phone, clientId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "30d" },
      );

      return res.status(201).json({
        message: "Conta criada!",
        token,
        user: { id: user.id, name: user.name, phone: user.phone },
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar conta." });
    }
  }

  async login(req: Request, res: Response) {
    const { phone, pin } = req.body;

    try {
      const user = await prisma.app_clients.findUnique({ where: { phone } });

      if (!user) {
        return res.status(400).json({ error: "Telefone não cadastrado." });
      }

      const pinMatch = await compare(String(pin), user.pin_hash);

      if (!pinMatch) {
        return res.status(400).json({ error: "PIN incorreto." });
      }

      const token = sign(
        { phone: user.phone, clientId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "30d" },
      );

      return res.json({
        token,
        user: { id: user.id, name: user.name, phone: user.phone },
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  // 3. OBTER PERFIL (ME) - COM AVATAR
  async me(req: Request, res: Response) {
    const { authenticatedPhone } = req.body;

    try {
      const user = await prisma.app_clients.findUnique({
        where: { phone: authenticatedPhone },
        select: {
          id: true,
          name: true,
          phone: true,
          created_at: true,
          avatar_url: true, // 👈 Importante
        },
      });

      if (!user)
        return res.status(404).json({ error: "Usuário não encontrado." });

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar perfil." });
    }
  }

  // 4. ATUALIZAR PERFIL (Novo)
  async update(req: Request, res: Response) {
    const { authenticatedPhone } = req.body;
    const { name, avatar_url } = req.body;

    try {
      const user = await prisma.app_clients.update({
        where: { phone: authenticatedPhone },
        data: { name, avatar_url },
      });

      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar perfil." });
    }
  }

  // 5. EXCLUIR
  async delete(req: Request, res: Response) {
    const { authenticatedPhone } = req.body;
    try {
      const user = await prisma.app_clients.findUnique({
        where: { phone: authenticatedPhone },
      });
      if (!user) return res.status(404).json({ error: "User not found" });
      await prisma.app_clients.delete({ where: { id: user.id } });
      return res.json({ message: "Conta excluída." });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao excluir." });
    }
  }
}
