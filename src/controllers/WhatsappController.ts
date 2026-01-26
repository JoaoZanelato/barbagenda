import { Request, Response } from "express";
import twilio from "twilio";

export class WhatsappController {
  // Credenciais do Twilio
  private accountSid = process.env.TWILIO_ACCOUNT_SID || "";
  private authToken = process.env.TWILIO_AUTH_TOKEN || "";
  private twilioNumber =
    process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

  private client = twilio(this.accountSid, this.authToken);

  // RECEBER mensagens do WhatsApp (via Twilio)
  async receive(req: Request, res: Response) {
    console.log("=".repeat(60));
    console.log("🔔 TWILIO WEBHOOK - NOVA MENSAGEM!");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Body completo:", JSON.stringify(req.body, null, 2));
    console.log("=".repeat(60));

    try {
      // Twilio envia dados como application/x-www-form-urlencoded
      const from = req.body.From; // Ex: whatsapp:+5554996303319
      const to = req.body.To; // Ex: whatsapp:+14155238886
      const messageBody = req.body.Body; // Texto da mensagem
      const profileName = req.body.ProfileName || "Desconhecido"; // Nome do contato
      const numMedia = parseInt(req.body.NumMedia || "0"); // Quantidade de mídias

      console.log("------------------------------------------------");
      console.log(`💬 MENSAGEM RECEBIDA!`);
      console.log(`👤 De: ${profileName} (${from})`);
      console.log(`📱 Para: ${to}`);
      console.log(`📄 Mensagem: "${messageBody}"`);
      console.log(`🖼️ Mídias: ${numMedia}`);
      console.log("------------------------------------------------");

      // ============================================
      // LÓGICA DO SEU BOT AQUI
      // ============================================

      const textoLower = messageBody.toLowerCase();

      if (
        textoLower.includes("agendar") ||
        textoLower.includes("horario") ||
        textoLower.includes("horário")
      ) {
        await this.sendMessage(
          from,
          "Ótimo! 💈 Vamos agendar seu horário.\n\nQual dia você prefere?\n\nEx: Amanhã, Segunda-feira, 25/01",
        );
      } else if (
        textoLower.includes("oi") ||
        textoLower.includes("olá") ||
        textoLower.includes("ola")
      ) {
        await this.sendMessage(
          from,
          `Olá ${profileName}! 👋\n\nBem-vindo à nossa barbearia! 💈\n\nComo posso ajudar?\n\n• Digite *agendar* para marcar horário\n• Digite *serviços* para ver nossos serviços`,
        );
      } else if (
        textoLower.includes("serviço") ||
        textoLower.includes("servico") ||
        textoLower.includes("preço") ||
        textoLower.includes("preco")
      ) {
        await this.sendMessage(
          from,
          "📋 Nossos serviços:\n\n💈 Corte de cabelo - R$ 30\n✂️ Barba - R$ 20\n🔥 Corte + Barba - R$ 45\n\nDigite *agendar* para marcar seu horário!",
        );
      } else {
        await this.sendMessage(
          from,
          "Recebi sua mensagem! 😊\n\nDigite:\n• *agendar* para marcar horário\n• *serviços* para ver preços",
        );
      }

      // Twilio espera uma resposta TwiML (XML) vazia
      const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;
      res.type("text/xml").send(twiml);
    } catch (error) {
      console.error("❌ Erro ao processar mensagem:", error);
      res.status(500).send("Erro interno");
    }
  }

  // ENVIAR mensagem pelo WhatsApp
  async sendMessage(to: string, message: string) {
    try {
      console.log(`📤 Enviando mensagem para ${to}...`);

      const response = await this.client.messages.create({
        body: message,
        from: this.twilioNumber,
        to: to, // Já vem no formato whatsapp:+5554996303319
      });

      console.log("✅ Mensagem enviada com sucesso!");
      console.log("   SID:", response.sid);
      console.log("   Status:", response.status);

      return response;
    } catch (error) {
      console.error("❌ Erro ao enviar mensagem:", error);
      throw error;
    }
  }

  // VERIFICAÇÃO (não é mais necessário com Twilio, mas mantém para compatibilidade)
  async verify(req: Request, res: Response) {
    console.log("⚠️ Rota de verificação chamada (não necessária com Twilio)");
    return res.status(200).send("OK");
  }
}
