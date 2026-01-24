import { Request, Response } from "express";

export class WhatsappController {
  // 1. VERIFICAÇÃO (Mantemos igual)
  async verify(req: Request, res: Response) {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    const MY_VERIFY_TOKEN = "barber-secret";

    if (mode === "subscribe" && token === MY_VERIFY_TOKEN) {
      console.log("VERIFICAÇÃO DO WHATSAPP REALIZADA COM SUCESSO");
      return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: "Token inválido" });
  }

  // 2. RECEBER MENSAGENS (A Mágica acontece aqui) 🪄
  async receive(req: Request, res: Response) {
    const body = req.body;

    // Verifica se é uma notificação válida do WhatsApp
    if (body.object) {
      // Navega naquele JSON gigante para achar a mensagem
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      // Se tiver uma mensagem de texto...
      if (message && message.type === "text") {
        const from = message.from; // Número do cliente (ex: 5554...)
        const text = message.text.body; // O que ele escreveu
        const name = value.contacts?.[0]?.profile?.name || "Desconhecido"; // Nome do cliente

        console.log("------------------------------------------------");
        console.log(`💬 NOVA MENSAGEM!`);
        console.log(`👤 Cliente: ${name} (${from})`);
        console.log(`📄 Diz: "${text}"`);
        console.log("------------------------------------------------");

        // AQUI VAMOS COLOCAR A INTELIGÊNCIA DEPOIS
        // if (text === "agendar") ...
      }

      // Responde para o Facebook que recebemos (senão eles mandam de novo)
      return res.status(200).send("EVENT_RECEIVED");
    } else {
      return res.status(404).send();
    }
  }
}
