import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export class AuthController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: { email },
      include: { tenants: true },
    });

    if (!user) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    const passwordMatch = await compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    // Gera o Token
    const token = sign(
      {
        name: user.name,
        email: user.email,
        tenantId: user.tenant_id,
        role: user.role, // O token já tem o role, mas o cookie é invisível pro JS
      },
      "SEGREDO_SUPER_SECRETO_DO_JWT",
      {
        subject: user.id,
        expiresIn: "30d",
      },
    );

    // Cookie HTTP-Only
    res.cookie("barber_token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login realizado com sucesso!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // <--- ADICIONE ISSO AQUI! (O Frontend precisa ler isso)
        barbearia: user.tenants?.name,
      },
    });
  }
}
