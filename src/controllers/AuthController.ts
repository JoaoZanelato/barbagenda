import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

// 👇 ATENÇÃO: Tem de ser "export class" (Sem default)
export class AuthController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    console.log(`[AUTH LOGIN] Tentativa: ${email}`);

    try {
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

      console.log(`[AUTH SUCCESS] Token gerado para ${user.name}`);

      res.cookie("barber_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        message: "Login realizado com sucesso!",
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          barbearia: user.tenants?.name,
        },
      });
    } catch (error) {
      console.error("[AUTH ERROR]", error);
      return res.status(500).json({ error: "Erro interno." });
    }
  }
}
