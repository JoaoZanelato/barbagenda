import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
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
  const [expoPushToken, setExpoPushToken] = useState<string>("");

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        sendTokenToBackend(token, isBarber);
      }
    });
  }, []);

  async function sendTokenToBackend(token: string, isBarber: boolean) {
    try {
      const url = isBarber
        ? "/notifications/token"
        : "/mobile/notifications/token";
      await api.post(url, { pushToken: token });
      console.log("Token Push enviado com sucesso:", token);
    } catch (error) {
      // Ignora erro silenciosamente se usuário não estiver logado ainda
      console.log("Token não enviado (provavelmente não logado).");
    }
  }

  return { expoPushToken };
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
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

    if (finalStatus !== "granted") {
      console.log("Falha ao obter permissão para notificação!");
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
  } else {
    console.log("Precisa de um dispositivo físico para Push Notifications");
  }

  return token;
}
