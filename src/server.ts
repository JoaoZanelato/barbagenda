import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path"; // 👈 Importe path
import fs from "fs"; // 👈 Importe fs
import { router } from "./routes";
import { CronService } from "./services/CronService";

const app = express();

app.use(express.json());
app.use(cookieParser());

// 👇 CRIA A PASTA UPLOADS SE NÃO EXISTIR
const uploadFolder = path.resolve(__dirname, "..", "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
  console.log("📁 Pasta 'uploads' criada com sucesso!");
}

// 👇 LIBERA ACESSO ÀS FOTOS (IMPORTANTE PARA O MOBILE VER A IMAGEM)
app.use("/files", express.static(uploadFolder));

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(router);

// Middleware de Erro Global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ ERRO NO SERVIDOR:", err);
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

new CronService();

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} 🚀`));
