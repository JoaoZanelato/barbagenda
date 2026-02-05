import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.headers.authorization || req.cookies.barber_token;

  if (!authToken) {
    return res.status(401).json({
      errorCode: "token.missing",
      message: "Faça login para continuar",
    });
  }

  const token = authToken.includes("Bearer")
    ? authToken.split(" ")[1]
    : authToken;

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as any;

    const { sub, tenant_id, tenantId } = decoded;
    const finalTenantId = tenant_id || tenantId;

    if (!finalTenantId) {
      return res.status(401).json({ error: "Token inválido (sem tenant_id)" });
    }

    (req as any).user_id = sub;
    (req as any).tenant_id = finalTenantId;

    req.user = {
      id: sub,
      tenant_id: finalTenantId,
    };

    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ errorCode: "token.expired", message: "Sessão expirada" });
  }
}
