import { Expo } from "expo-server-sdk";

export class NotificationService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  async send(pushToken: string, title: string, body: string) {
    // Verifica se é um token válido da Expo
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token inválido: ${pushToken}`);
      return;
    }

    const messages = [];

    messages.push({
      to: pushToken,
      sound: "default", // Fallback para iOS (o iOS usa 'default' ou nome do arquivo se estiver no bundle)
      title: title,
      body: body,
      data: { url: "/agendamentos" }, // Dados extras opcionais

      // 👇 O SEGREDO: Força o Android a usar o canal que configuramos com o som personalizado
      channelId: "barber-sound-v2",

      priority: "high",
    });

    try {
      // Envia a notificação
      const chunks = this.expo.chunkPushNotifications(messages);

      for (const chunk of chunks) {
        try {
          await this.expo.sendPushNotificationsAsync(chunk);
          console.log("🔔 Notificação enviada para a Expo (Canal V2)!");
        } catch (error) {
          console.error("Erro ao enviar chunk de notificação:", error);
        }
      }
    } catch (error) {
      console.error("Erro geral no serviço de notificação:", error);
    }
  }
}
