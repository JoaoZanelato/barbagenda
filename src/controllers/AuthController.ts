import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export class AuthController {
  async handle(req: Request, res: Response) {
    // 👇 REGRA: Barbeiro usa Email e Senha
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Precisa enviar email e senha" });
    }

    // Busca na tabela USERS (Profissionais/Admins)
    const user = await prisma.users.findFirst({
      where: { email },
      include: {
        tenants: {
          select: {
            id: true,
            name: true,
            logo_url: true,
            plan_status: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    // Verifica a senha criptografada
    const passwordMatch = await compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    if (!user.active) {
      return res.status(401).json({ error: "Usuário inativo." });
    }

    // Gera o Token
    const token = sign(
      {
        name: user.name,
        email: user.email,
        tenant_id: user.tenant_id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: "30d",
      },
    );

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenant: user.tenants,
      token: token,
    });
  }
}
