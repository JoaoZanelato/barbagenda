import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { router } from "./routes";
import { CronService } from "./services/CronService";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true, // Isso permite o envio de Cookies e Headers de Auth
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(router);

// Middleware de Erro Global (Nativo do Express 5)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

// Inicializa os Lembretes Automáticos
new CronService();

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} 🚀`));
