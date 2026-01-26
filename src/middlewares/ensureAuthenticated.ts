import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
  tenantId: string;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Tenta pegar o token do Header (Authorization) OU do Cookie
  const authToken = req.headers.authorization || req.cookies.barber_token;

  if (!authToken) {
    return res
      .status(401)
      .json({
        errorCode: "token.missing",
        message: "Faça login para continuar",
      });
  }

  // Se vier com 'Bearer ' na frente (header), limpa. Se vier do cookie, já é limpo.
  const token = authToken.includes("Bearer")
    ? authToken.split(" ")[1]
    : authToken;

  try {
    const { sub, tenantId } = verify(
      token,
      "SEGREDO_SUPER_SECRETO_DO_JWT",
    ) as IPayload;

    // Injeta os dados na requisição para os Controllers usarem
    (req as any).user_id = sub;
    (req as any).tenant_id = tenantId;

    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ errorCode: "token.expired", message: "Sessão expirada" });
  }
}
