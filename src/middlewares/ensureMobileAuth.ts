import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string; // ID do cliente vem no 'sub'
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
    const { sub } = verify(token, process.env.JWT_SECRET as string) as IPayload;

    // Injeta o ID para os controllers usarem
    (req as any).user_id = sub;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
