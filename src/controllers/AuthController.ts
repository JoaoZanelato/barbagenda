import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export class AuthController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    // 1. Busca usuário
    const user = await prisma.users.findUnique({
      where: { email },
      include: { tenants: true },
    });

    if (!user) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    // 2. Verifica senha
    const passwordMatch = await compare(password, user.password_hash);

    // Fallback para o usuário de teste antigo (se ainda existir)
    const isTestUser =
      user.password_hash === "hash_senha_segura" && password === "123456";

    if (!passwordMatch && !isTestUser) {
      return res.status(400).json({ error: "Email ou senha incorretos" });
    }

    // 3. Gera Token
    const token = sign(
      {
        name: user.name,
        email: user.email,
        tenantId: user.tenant_id,
        role: user.role,
      },
      "SEGREDO_SUPER_SECRETO_DO_JWT",
      {
        subject: user.id,
        expiresIn: "30d",
      },
    );

    // 4. MÁGICA: Envia o Token como Cookie HTTP-Only
    // O frontend não precisa fazer NADA, o navegador guarda sozinho.
    res.cookie("barber_token", token, {
      httpOnly: true, // Segurança: JavaScript não consegue ler esse cookie
      secure: false, // Use 'true' se estiver em HTTPS (produção)
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
    });

    return res.json({
      message: "Login realizado com sucesso!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        barbearia: user.tenants?.name,
      },
    });
  }
}
