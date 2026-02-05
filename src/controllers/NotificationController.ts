import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class NotificationController {
  // --- BARBEIRO ---

  async saveBarberToken(req: Request, res: Response) {
    const { token } = req.body;
    // user_id vem do ensureAuthenticated (Web)
    const user_id = (req as any).user_id;

    if (!token) return res.status(400).json({ error: "Token ausente" });

    try {
      await prisma.users.update({
        where: { id: user_id },
        data: { push_token: token },
      });
      return res.status(200).send();
    } catch (error) {
      return res.status(500).json({ error: "Erro ao salvar token barber" });
    }
  }

  async removeBarberToken(req: Request, res: Response) {
    const user_id = (req as any).user_id;
    try {
      await prisma.users.update({
        where: { id: user_id },
        data: { push_token: null },
      });
      return res.status(200).send();
    } catch (error) {
      return res.status(200).send();
    }
  }

  // --- CLIENTE ---

  async saveClientToken(req: Request, res: Response) {
    const { token } = req.body;
    // 👇 CORREÇÃO: Pega user_id do ensureMobileAuth
    const client_id = (req as any).user_id;

    if (!token) return res.status(400).json({ error: "Token ausente" });

    try {
      await prisma.app_clients.update({
        where: { id: client_id },
        data: { push_token: token },
      });
      return res.status(200).send();
    } catch (error) {
      return res.status(500).json({ error: "Erro ao salvar token cliente" });
    }
  }

  async removeClientToken(req: Request, res: Response) {
    const client_id = (req as any).user_id; // 👇 CORREÇÃO
    try {
      await prisma.app_clients.update({
        where: { id: client_id },
        data: { push_token: null },
      });
      return res.status(200).send();
    } catch (error) {
      return res.status(200).send();
    }
  }
}
