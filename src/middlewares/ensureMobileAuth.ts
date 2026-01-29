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

  try {
    const { phone, clientId } = verify(
      token,
      "SEGREDO_SUPER_SECRETO_DO_JWT_MOBILE",
    ) as IPayload;

    // Injeta dados do usuário na requisição
    req.body.authenticatedPhone = phone;
    req.body.authenticatedName = "Cliente App"; // Fallback simples

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
