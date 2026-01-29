import express from "express";
import cors from "cors";
import { router } from "./routes";
import cookieParser from "cookie-parser";

const app = express();

// 1. Log de Entrada (Monitoramento)
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] 🔔 BATEU NA PORTA: ${req.method} ${req.url}`,
  );
  next();
});

// 2. Leitor de Cookies (Necessário para autenticação futura se usar cookies)
app.use(cookieParser());

// 3. Middlewares de parse (JSON e URL Encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. CORS (Configurado para o Frontend)
app.use(
  cors({
    origin: "http://localhost:5173", // URL do seu Frontend Vite
    credentials: true, // Permite enviar cookies/headers de autorização
  }),
);

// 5. Bypass do warning do ngrok (Para não travar o webhook)
app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

// 6. Rotas da Aplicação
app.use(router);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
  console.log(
    `📱 Webhook ngrok: https://medicamentous-larisa-nonelliptic.ngrok-free.dev`,
  );
});
