import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class NotificationController {
  // --- BARBEIRO ---

  // Salvar Token
  async saveBarberToken(req: Request, res: Response) {
    const { token } = req.body;
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

  // Remover Token (Logout)
  async removeBarberToken(req: Request, res: Response) {
    const user_id = (req as any).user_id;
    try {
      await prisma.users.update({
        where: { id: user_id },
        data: { push_token: null }, // 🗑️
      });
      return res.status(200).send();
    } catch (error) {
      return res.status(200).send();
    }
  }

  // --- CLIENTE ---

  // Salvar Token
  async saveClientToken(req: Request, res: Response) {
    const { token } = req.body;
    const client_id = (req as any).clientId;

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

  // Remover Token (Logout)
  async removeClientToken(req: Request, res: Response) {
    const client_id = (req as any).clientId;
    try {
      await prisma.app_clients.update({
        where: { id: client_id },
        data: { push_token: null }, // 🗑️
      });
      return res.status(200).send();
    } catch (error) {
      return res.status(200).send();
    }
  }
}
