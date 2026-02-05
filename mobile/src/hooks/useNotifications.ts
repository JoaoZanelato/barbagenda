import { useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../services/API";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications(isBarber: boolean = false) {
  const navigation = useNavigation<any>();

  // Refs para guardar as inscrições
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        const url = isBarber
          ? "/notifications/token"
          : "/mobile/notifications/token";
        api.post(url, { token }).catch(() => {});
      }
    });

    // 1. Listener de Notificação Recebida (App Aberto)
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // console.log("Notificação recebida:", notification);
      });

    // 2. Listener de Clique na Notificação
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data?.screen) {
          if (data.screen === "BarberAgenda") navigation.navigate("Agenda");
          else if (data.screen === "ClientAppointments")
            navigation.navigate("Appointments");
        }
      });

    // 👇 LIMPEZA CORRIGIDA (Clean Up)
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove(); // <--- O jeito novo
      }
      if (responseListener.current) {
        responseListener.current.remove(); // <--- O jeito novo
      }
    };
  }, [isBarber, navigation]);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("barber-sound-v3", {
      name: "Notificações de Corte",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
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

    // Pega o token sem precisar de ID se o eas.json estiver configurado
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  }
}
