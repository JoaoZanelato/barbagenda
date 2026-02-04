import { useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native"; // 👈 Importe isso
import api from "../services/API";

// Configura como a notificação aparece com o App ABERTO
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications(isBarber: boolean = false) {
  const navigation = useNavigation<any>(); // 👈 Acesso à navegação
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    let isMounted = true;

    // 1. Registrar Token
    registerForPushNotificationsAsync().then((token) => {
      if (token && isMounted) {
        console.log("🔔 Token Mobile:", token);
        const url = isBarber
          ? "/notifications/token"
          : "/mobile/notifications/token";
        api
          .post(url, { token })
          .catch((err) => console.log("Erro token:", err));
      }
    });

    // 2. Ouvir Notificação Recebida (App Aberto)
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // Pode fazer algo aqui se quiser (ex: atualizar lista)
      });

    // 3. Ouvir CLIQUE na Notificação (Redirecionamento) 🚀
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        if (data && data.screen) {
          console.log("Navigating to:", data.screen);

          // Mapeie os nomes das rotas do seu App aqui
          switch (data.screen) {
            case "BarberAgenda":
              navigation.navigate("Agenda"); // Nome da rota do Tab Barbeiro
              break;
            case "ClientAppointments":
              navigation.navigate("MyAppointments"); // Nome da rota do Cliente
              break;
            default:
              console.log("Rota desconhecida:", data.screen);
          }
        }
      });

    return () => {
      isMounted = false;
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [isBarber, navigation]);
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("barber-sound-v3", {
      name: "Notificações de Corte V3",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "scissor.wav",
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
    if (finalStatus !== "granted") return;

    // Seu ID do EAS
    const projectId = "ee0e849b-1ead-49b6-b472-f530a39097d6";
    try {
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } catch (error) {
      console.log("Erro Token:", error);
    }
  }

  return token;
}
