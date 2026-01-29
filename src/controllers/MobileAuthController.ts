import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export class MobileAuthController {
  // 1. REGISTRO (Nome, Telefone, PIN)
  async register(req: Request, res: Response) {
    const { name, phone, pin } = req.body;

    if (!name || !phone || !pin) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    if (String(pin).length !== 4) {
      return res.status(400).json({ error: "O PIN deve ter 4 dígitos." });
    }

    const userExists = await prisma.app_clients.findUnique({
      where: { phone },
    });
    if (userExists) {
      return res.status(400).json({ error: "Telefone já cadastrado." });
    }

    const pinHash = await hash(String(pin), 8);

    const user = await prisma.app_clients.create({
      data: {
        name,
        phone,
        pin_hash: pinHash,
      },
    });

    return res.status(201).json({
      message: "Conta criada!",
      user: { id: user.id, name: user.name, phone: user.phone },
    });
  }

  // 2. LOGIN (Telefone, PIN)
  async login(req: Request, res: Response) {
    const { phone, pin } = req.body;

    const user = await prisma.app_clients.findUnique({ where: { phone } });
    if (!user) {
      return res.status(400).json({ error: "Telefone ou PIN incorretos." });
    }

    const pinMatch = await compare(String(pin), user.pin_hash);
    if (!pinMatch) {
      return res.status(400).json({ error: "Telefone ou PIN incorretos." });
    }

    const token = sign(
      { phone: user.phone, clientId: user.id }, // Payload
      "SEGREDO_SUPER_SECRETO_DO_JWT_MOBILE", // Use .env em produção
      { expiresIn: "30d" },
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, phone: user.phone },
    });
  }
}
