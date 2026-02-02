import { useEffect } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import api from "../services/API";

// Configuração para a notificação aparecer mesmo com o App aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications(isBarber: boolean = false) {
  useEffect(() => {
    let isMounted = true;

    registerForPushNotificationsAsync().then((token) => {
      if (token && isMounted) {
        console.log("🔔 Token Gerado no Mobile:", token);

        // Define a URL correta baseado no tipo de usuário
        const url = isBarber
          ? "/notifications/token"
          : "/mobile/notifications/token";

        // Envia para o backend (Corrigido para enviar { token })
        api
          .post(url, { token: token })
          .then(() =>
            console.log("✅ Token enviado com sucesso para o Backend!"),
          )
          .catch((err) =>
            console.log("❌ Falha ao enviar token para o backend:", err),
          );
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isBarber]);
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    // 👇 CRUCIAL: Criamos a versão V2 do canal para limpar configurações antigas
    await Notifications.setNotificationChannelAsync("barber-sound-v2", {
      name: "Notificações de Corte",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "scissor.wav", // O arquivo deve estar configurado no app.json e na pasta assets
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Sem permissão para notificações!");
      return;
    }

    // ID do Projeto (Hardcoded para garantir que funcione, já que o automático falhou)
    const projectId = "ee0e849b-1ead-49b6-b472-f530a39097d6";

    try {
      // Pega o token usando o ID do projeto explícito
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } catch (error) {
      console.log("ERRO AO PEGAR TOKEN:", error);
    }
  } else {
    console.log(
      "Emulador não suporta Push Notifications. Use um celular real.",
    );
  }

  return token;
}
