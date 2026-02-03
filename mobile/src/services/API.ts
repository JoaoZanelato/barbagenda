import axios from "axios";

const api = axios.create({
  baseURL: "http:/192.168.0.108:3333",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("[API Error]", error.response.data);
    } else if (error.request) {
      // Dica para debug: Mostra qual endereço tentou acessar
      console.error(
        `[API Network Error] Falha ao conectar em ${api.defaults.baseURL}. O servidor está rodando? O IP está certo?`,
      );
    } else {
      console.error("[API Setup Error]", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
