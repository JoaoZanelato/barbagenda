import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { deleteFile } from "../utils/file"; // 👈 Importe o utilitário

export class MobileAuthController {
  // 1. REGISTER
  async register(req: Request, res: Response) {
    const { name, email, password, phone } = req.body;

    if (!email || !password || !phone) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const userExists = await prisma.app_clients.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (userExists) {
      return res
        .status(400)
        .json({ error: "E-mail ou telefone já cadastrado" });
    }

    const passwordHash = await hash(password, 8);

    const client = await prisma.app_clients.create({
      data: {
        name,
        email,
        phone,
        password: passwordHash,
      },
    });

    return res.json(client);
  }

  // 2. LOGIN
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const client = await prisma.app_clients.findUnique({
      where: { email },
    });

    if (!client) {
      return res.status(400).json({ error: "E-mail ou senha incorretos" });
    }

    const passwordMatch = await compare(password, client.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "E-mail ou senha incorretos" });
    }

    const token = sign(
      { clientId: client.id, email: client.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" },
    );

    return res.json({
      id: client.id,
      name: client.name,
      email: client.email,
      token,
    });
  }

  // 3. ME (Perfil)
  async me(req: Request, res: Response) {
    const client_id = (req as any).clientId;
    const client = await prisma.app_clients.findUnique({
      where: { id: client_id },
    });
    return res.json(client);
  }

  // 4. UPDATE (Com delete de imagem antiga)
  async update(req: Request, res: Response) {
    const { name, email, phone, avatar_url } = req.body;
    const client_id = (req as any).clientId;

    try {
      // Busca usuário atual
      const currentUser = await prisma.app_clients.findUnique({
        where: { id: client_id },
      });

      // Se mudou a foto, deleta a antiga
      if (
        currentUser?.avatar_url &&
        avatar_url &&
        currentUser.avatar_url !== avatar_url
      ) {
        await deleteFile(currentUser.avatar_url);
      }

      const client = await prisma.app_clients.update({
        where: { id: client_id },
        data: { name, email, phone, avatar_url },
      });

      return res.json(client);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar perfil" });
    }
  }

  // 5. DELETE (Deleta conta e imagem)
  async delete(req: Request, res: Response) {
    const client_id = (req as any).clientId;

    try {
      const client = await prisma.app_clients.findUnique({
        where: { id: client_id },
      });

      if (client?.avatar_url) {
        await deleteFile(client.avatar_url);
      }

      await prisma.app_clients.delete({
        where: { id: client_id },
      });

      return res.status(200).send();
    } catch (error) {
      return res.status(400).json({ error: "Erro ao deletar conta" });
    }
  }
}
