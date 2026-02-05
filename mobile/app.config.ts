import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "BarbAgenda",
  slug: "barbagenda",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "light",
  owner: "zanelatozz", // Adicionado do seu json original

  splash: {
    image: "./assets/images/icon.png",
    resizeMode: "contain",
    backgroundColor: "#09090B",
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.barbagenda.app",
  },

  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#00000000",
    },
    package: "com.barbagenda.app", // Seu pacote correto
    googleServicesFile: "./google-services.json", // Mantido do original
    config: {
      googleMaps: {
        // 🔐 AQUI ESTÁ A PROTEÇÃO: A chave vem do ambiente (.env e EAS Secrets)
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION",
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "NOTIFICATIONS",
    ],
  },

  web: {
    bundler: "metro",
    output: "single", // Mantido single para funcionar sem router
    favicon: "./assets/images/icon.png",
  },

  // 👇 Plugins mesclados (Location + Notifications + Camera + Fonts)
  plugins: [
    "expo-font",
    [
      "expo-notifications",
      {
        icon: "./assets/images/notification_icon.png",
        color: "#FF231F7C",
        sounds: ["./assets/sounds/scissor.wav"],
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "Permita o acesso às suas fotos para atualizar o perfil.",
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "O aplicativo precisa da sua localização para mostrar as barbearias próximas no mapa.",
      },
    ],
  ],

  extra: {
    eas: {
      // ✅ ID CORRETO RECUPERADO DO SEU ARQUIVO
      projectId: "ee0e849b-1ead-49b6-b472-f530a39097d6",
    },
  },
});
