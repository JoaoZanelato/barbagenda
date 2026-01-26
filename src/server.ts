import express from "express";
import cors from "cors";
import { router } from "./routes";

const app = express();

// 1. Log de Entrada (O Dedo-Duro) - ISSO É O QUE VAI TE SALVAR
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] 🔔 BATEU NA PORTA: ${req.method} ${req.url}`,
  );
  next();
});

// 2. Bypass do warning do ngrok
app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

// 3. Middlewares de parse
app.use(express.json()); // Para Meta/APIs que enviam JSON
app.use(express.urlencoded({ extended: true })); // ESSENCIAL para Twilio!

// 4. CORS
app.use(cors());

// 5. Rotas
app.use(router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
  console.log(
    `📱 Webhook ngrok: https://medicamentous-larisa-nonelliptic.ngrok-free.dev`,
  );
});
