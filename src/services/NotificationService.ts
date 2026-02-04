import { Expo } from "expo-server-sdk";

export class NotificationService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  // 👇 Agora aceita 'data' (opcional)
  async send(pushToken: string, title: string, body: string, data?: any) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token inválido: ${pushToken}`);
      return;
    }

    const messages = [];

    messages.push({
      to: pushToken,
      sound: "default",
      title: title,
      body: body,
      // 👇 Envia os dados para o redirecionamento
      data: data || {},
      channelId: "barber-sound-v3",
      priority: "high",
    });

    try {
      const chunks = this.expo.chunkPushNotifications(messages);

      for (const chunk of chunks) {
        try {
          await this.expo.sendPushNotificationsAsync(chunk);
          console.log("🔔 Notificação enviada:", title);
        } catch (error) {
          console.error("Erro no envio:", error);
        }
      }
    } catch (error) {
      console.error("Erro geral notificação:", error);
    }
  }
}
