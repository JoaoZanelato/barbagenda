import axios from "axios";

/**
 * ⚠️ IMPORTANTE:
 * No Android Emulator use: 'http://10.0.2.2:3000'
 * No iOS Simulator use: 'http://localhost:3000'
 * No Celular Físico (Expo Go) use o IP da sua máquina: 'http://192.168.X.X:3000'
 * * Para descobrir seu IP:
 * - Windows: Abra o terminal e digite `ipconfig` (procure por IPv4 Address)
 * - Mac/Linux: Abra o terminal e digite `ifconfig`
 */

const api = axios.create({
  // 👇 TROQUE PELO SEU IP AQUI
  baseURL: "http://192.168.1.15:3000",
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor opcional para logs (ajuda a debugar no mobile)
api.interceptors.request.use((config) => {
  // console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // O servidor respondeu com um status de erro (4xx, 5xx)
      console.error("[API Error]", error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta (erro de rede/IP)
      console.error(
        "[API Network Error] Verifique o IP e se o Backend está rodando.",
      );
    } else {
      console.error("[API Setup Error]", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
