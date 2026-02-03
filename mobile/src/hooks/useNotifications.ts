import { useEffect } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import api from "../services/API";

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

        const url = isBarber
          ? "/notifications/token"
          : "/mobile/notifications/token";

        api
          .post(url, { token: token }) // Enviando { token } corretamente
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
    // 👇 MUDANÇA CRUCIAL: V3
    // Isso cria um canal NOVO. O Android vai ler o arquivo 'scissor.wav' agora.
    await Notifications.setNotificationChannelAsync("barber-sound-v3", {
      name: "Notificações de Corte V3",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "scissor.wav", // Certifique-se que o arquivo está em assets/sounds/scissor.wav (minúsculo)
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

    // Seu Project ID
    const projectId = "ee0e849b-1ead-49b6-b472-f530a39097d6";

    try {
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } catch (error) {
      console.log("ERRO AO PEGAR TOKEN:", error);
    }
  } else {
    console.log("Emulador não suporta Push. Use celular real.");
  }

  return token;
}
