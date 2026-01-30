import axios from "axios";

export class NotificationService {
  async send(token: string | null, title: string, body: string, data?: any) {
    if (!token) return;

    if (
      !token.startsWith("ExponentPushToken[") &&
      !token.startsWith("ExpoPushToken[")
    ) {
      console.log("Token de notificação inválido ignorado:", token);
      return;
    }

    const message = {
      to: token,
      sound: "default", // iOS usa o default ou configuração especial de build
      title: title,
      body: body,
      data: data || {},
      android: {
        channelId: "barber-sound", // 👇 AQUI: Manda o Android usar o som da tesoura
      },
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
