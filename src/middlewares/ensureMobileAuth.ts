import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  phone: string;
  clientId: string;
}

export function ensureMobileAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: "Token não informado" });
  }

  const [, token] = authToken.split(" ");

  if (!process.env.JWT_SECRET) {
    console.error("❌ ERRO GRAVE: JWT_SECRET não definido.");
    return res.status(500).json({ error: "Erro interno de configuração" });
  }

  try {
    const { phone } = verify(
      token,
      process.env.JWT_SECRET as string,
    ) as IPayload;

    // 👇 A CORREÇÃO MÁGICA ESTÁ AQUI:
    // Se req.body não existir (comum em GET), criamos um objeto vazio.
    if (!req.body) {
      req.body = {};
    }

    // Agora é seguro injetar os dados
    req.body.authenticatedPhone = phone;
    req.body.authenticatedName = "Cliente App";

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
