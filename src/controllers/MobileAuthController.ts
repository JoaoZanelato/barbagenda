import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export class MobileAuthController {
  // 1. REGISTRO DE CLIENTE (Nome, Telefone, PIN)
  async register(req: Request, res: Response) {
    const { name, phone, pin } = req.body;

    console.log(`[MOBILE REGISTER] Tentativa: ${name}, ${phone}`);

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
        data: {
          name,
          phone,
          pin_hash: pinHash,
        },
      });

      // Gera token para já logar direto após registro
      const token = sign(
        { phone: user.phone, clientId: user.id },
        "SEGREDO_SUPER_SECRETO_DO_JWT_MOBILE",
        { expiresIn: "30d" },
      );

      return res.status(201).json({
        message: "Conta criada!",
        token,
        user: { id: user.id, name: user.name, phone: user.phone },
      });
    } catch (error) {
      console.error("[MOBILE REGISTER ERROR]", error);
      return res.status(500).json({ error: "Erro ao criar conta." });
    }
  }

  // 2. LOGIN DE CLIENTE (Telefone, PIN)
  async login(req: Request, res: Response) {
    const { phone, pin } = req.body;

    // 👇 LOGS DE DEBUG (Remova em produção)
    console.log(`[MOBILE LOGIN ATTEMPT] Phone: ${phone}, PIN: ${pin}`);

    try {
      const user = await prisma.app_clients.findUnique({ where: { phone } });

      if (!user) {
        console.log("[MOBILE LOGIN ERROR] Usuário não encontrado.");
        return res.status(400).json({ error: "Telefone não cadastrado." });
      }

      const pinMatch = await compare(String(pin), user.pin_hash);

      if (!pinMatch) {
        console.log("[MOBILE LOGIN ERROR] PIN incorreto.");
        return res.status(400).json({ error: "PIN incorreto." });
      }

      const token = sign(
        { phone: user.phone, clientId: user.id },
        "SEGREDO_SUPER_SECRETO_DO_JWT_MOBILE", // Use .env em produção!
        { expiresIn: "30d" },
      );

      console.log("[MOBILE LOGIN SUCCESS] Token gerado.");

      return res.json({
        token,
        user: { id: user.id, name: user.name, phone: user.phone },
      });
    } catch (error) {
      console.error("[MOBILE LOGIN ERROR]", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }
}
