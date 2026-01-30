import "dotenv/config";
import express, { Request, Response, NextFunction } from "express"; 
import cors from "cors";
import { router } from "./routes";
import { CronService } from "./services/CronService"; // 👈 Importação Nova

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

// Middleware de Erro Global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

// 👇 INICIALIZA O SISTEMA DE CRON JOBS
new CronService();

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} 🚀`));
