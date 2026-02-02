import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export class NotificationController {
  // Salva o token do Barbeiro (Admin/Profissional)
  async saveBarberToken(req: Request, res: Response) {
    const { token } = req.body;
    // Pega o ID do usuário logado (injetado pelo middleware ensureAuthenticated)
    const user_id = (req as any).user_id;

    if (!token) {
      return res.status(400).json({ error: "Token não enviado." });
    }

    try {
      console.log(`📝 Salvando Push Token para usuário ${user_id}...`);

      await prisma.users.update({
        where: { id: user_id },
        data: { push_token: token },
      });

      console.log("✅ Token salvo com sucesso!");
      return res.status(200).send();
    } catch (error) {
      console.error("❌ Erro ao salvar token:", error);
      return res.status(500).json({ error: "Erro interno ao salvar token" });
    }
  }

  // Salva o token do Cliente Final (App Cliente)
  async saveClientToken(req: Request, res: Response) {
    // Lógica similar para a tabela 'app_clients' ou 'customers' se você tiver login de cliente
    // Por enquanto, retorna 200 para não quebrar o app
    return res.status(200).send();
  }
}
