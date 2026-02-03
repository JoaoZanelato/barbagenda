import { Expo } from "expo-server-sdk"; // Certifique-se de ter rodado: npm install expo-server-sdk

export class NotificationService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  async send(pushToken: string, title: string, body: string) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token inválido: ${pushToken}`);
      return;
    }

    const messages = [];

    messages.push({
      to: pushToken,
      sound: "default", // iOS usa default ou nome do arquivo
      title: title,
      body: body,
      data: { url: "/agendamentos" },

      // 👇 O SEGREDO: Tem que bater com o nome do canal no Mobile (V3)
      channelId: "barber-sound-v3",

      priority: "high",
    });

    try {
      const chunks = this.expo.chunkPushNotifications(messages);

      for (const chunk of chunks) {
        try {
          await this.expo.sendPushNotificationsAsync(chunk);
          console.log("🔔 Notificação enviada (Canal V3)!");
        } catch (error) {
          console.error("Erro no envio:", error);
        }
      }
    } catch (error) {
      console.error("Erro geral notificação:", error);
    }
  }
}
