import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { deleteFile } from "../utils/file";

export class MobileAuthController {
  // 1. REGISTER
  async register(req: Request, res: Response) {
    const { name, phone, pin } = req.body; // Usa PIN

    if (!name || !phone || !pin) {
      return res.status(400).json({ error: "Preencha nome, telefone e PIN." });
    }

    const userExists = await prisma.app_clients.findUnique({
      where: { phone },
    });

    if (userExists) {
      return res.status(400).json({ error: "Telefone já cadastrado." });
    }

    const pinHash = await hash(pin, 8);

    try {
      const client = await prisma.app_clients.create({
        data: {
          name,
          phone,
          pin_hash: pinHash, // Salva o hash do PIN
        },
      });

      const token = sign({ sub: client.id }, process.env.JWT_SECRET as string, {
        expiresIn: "30d",
      });

      return res.json({
        id: client.id,
        name: client.name,
        phone: client.phone,
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar conta." });
    }
  }

  // 2. LOGIN
  async login(req: Request, res: Response) {
    const { phone, pin } = req.body;

    if (!phone || !pin) {
      return res.status(400).json({ error: "Informe telefone e PIN." });
    }

    // Busca pelo TELEFONE
    const client = await prisma.app_clients.findUnique({
      where: { phone },
    });

    if (!client) {
      return res.status(400).json({ error: "Telefone ou PIN incorretos." });
    }

    // Compara PIN
    const pinMatch = await compare(pin, client.pin_hash);

    if (!pinMatch) {
      return res.status(400).json({ error: "Telefone ou PIN incorretos." });
    }

    const token = sign({ sub: client.id }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });

    return res.json({
      id: client.id,
      name: client.name,
      phone: client.phone,
      avatar_url: client.avatar_url,
      token,
    });
  }

  // 3. ME (Perfil)
  async me(req: Request, res: Response) {
    const user_id = (req as any).user_id; // Pega do middleware corrigido

    const client = await prisma.app_clients.findUnique({
      where: { id: user_id },
    });

    return res.json(client);
  }

  // 4. UPDATE
  async update(req: Request, res: Response) {
    const { name, phone, avatar_url } = req.body;
    const user_id = (req as any).user_id;

    try {
      const currentUser = await prisma.app_clients.findUnique({
        where: { id: user_id },
      });

      if (
        currentUser?.avatar_url &&
        avatar_url &&
        currentUser.avatar_url !== avatar_url
      ) {
        await deleteFile(currentUser.avatar_url);
      }

      const client = await prisma.app_clients.update({
        where: { id: user_id },
        data: { name, phone, avatar_url },
      });

      return res.json(client);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar perfil" });
    }
  }

  // 5. DELETE
  async delete(req: Request, res: Response) {
    const user_id = (req as any).user_id;
    try {
      const client = await prisma.app_clients.findUnique({
        where: { id: user_id },
      });
      if (client?.avatar_url) await deleteFile(client.avatar_url);

      await prisma.app_clients.delete({ where: { id: user_id } });
      return res.status(200).send();
    } catch (error) {
      return res.status(400).json({ error: "Erro ao deletar conta" });
    }
  }
}
