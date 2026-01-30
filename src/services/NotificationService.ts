import axios from "axios";

export class NotificationService {
  async send(token: string | null, title: string, body: string, data?: any) {
    if (!token) return;

    // Validação básica do token Expo
    if (
      !token.startsWith("ExponentPushToken[") &&
      !token.startsWith("ExpoPushToken[")
    ) {
      console.log("Token de notificação inválido ignorado:", token);
      return;
    }

    const message = {
      to: token,
      sound: "default",
      title: title,
      body: body,
      data: data || {},
    };

    try {
      await axios.post("https://exp.host/--/api/v2/push/send", message, {
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      });
      console.log(`[NOTIFICAÇÃO] Enviada para ${token}: ${title}`);
    } catch (error) {
      console.error("[NOTIFICAÇÃO ERRO]", error);
    }
  }
}
