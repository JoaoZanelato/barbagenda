import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { router } from "./routes";
import { CronService } from "./services/CronService";

const app = express();

app.use(express.json());
app.use(cookieParser());

// 👇 1. GARANTE QUE A PASTA UPLOADS EXISTE
const uploadFolder = path.resolve(__dirname, "..", "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// 👇 2. LIBERA O ACESSO ÀS IMAGENS PELO NAVEGADOR/CELULAR
// Agora, acessar http://IP:3333/files/foto.jpg vai mostrar a imagem
app.use("/files", express.static(uploadFolder));

app.use(
  cors({
    origin: "*", // Libera geral para desenvolvimento
    credentials: true,
  }),
);

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ ERRO NO SERVIDOR:", err);
  if (err instanceof Error) return res.status(400).json({ error: err.message });
  return res
    .status(500)
    .json({ status: "error", message: "Internal Server Error" });
});

new CronService();

const PORT = process.env.PORT || 3333;
// 👇 Mostra o IP no terminal para facilitar
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server rodando na porta ${PORT}`),
);
