import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class NotificationController {
  // Salva o token do Cliente Mobile
  async saveClientToken(req: Request, res: Response) {
    const { pushToken } = req.body;
    const { authenticatedPhone } = req.body; // Injetado pelo middleware mobile

    if (!authenticatedPhone || !pushToken) return res.status(400).send();

    try {
      await prisma.app_clients.update({
        where: { phone: authenticatedPhone },
        data: { push_token: pushToken },
      });
      return res.json({ ok: true });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao salvar token" });
    }
  }

  // Salva o token do Barbeiro/Admin (Web ou App Barbeiro)
  async saveBarberToken(req: Request, res: Response) {
    const { pushToken } = req.body;
    const userId = req.user_id; // Injetado pelo middleware auth

    if (!userId || !pushToken) return res.status(400).send();

    try {
      await prisma.users.update({
        where: { id: userId },
        data: { push_token: pushToken },
      });
      return res.json({ ok: true });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao salvar token" });
    }
  }
}
