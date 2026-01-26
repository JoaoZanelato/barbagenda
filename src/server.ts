import express from "express";
import cors from "cors";
import { router } from "./routes";
import cookieParser from "cookie-parser"; // <--- NOVO IMPORT

const app = express();

// 1. Log de Entrada (O Dedo-Duro)
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] 🔔 BATEU NA PORTA: ${req.method} ${req.url}`,
  );
  next();
});

// 2. Leitor de Cookies
app.use(cookieParser()); // <--- HABILITA LEITURA DE COOKIES

// 3. Middlewares de parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. CORS (Configurado para aceitar Cookies)
app.use(
  cors({
    origin: "http://localhost:3000", // IMPORTANTE: Coloque a URL do seu Frontend aqui (React/Next)
    credentials: true, // <--- Isso permite que o navegador envie o Cookie
  }),
);

// 5. Bypass do warning do ngrok (opcional, mantendo seu código original)
app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

// 6. Rotas
app.use(router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
  console.log(
    `📱 Webhook ngrok: https://medicamentous-larisa-nonelliptic.ngrok-free.dev`,
  );
});
