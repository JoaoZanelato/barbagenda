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

const uploadFolder = path.resolve(__dirname, "..", "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

app.use("/files", express.static(uploadFolder));

// 👇 CORS HÍBRIDO (Aceita Web e Mobile)
app.use(
  cors({
    origin: function (origin, callback) {
      // !origin = Requisições do Mobile (App) ou Insomnia/Postman
      // Se tiver origin (Web), verificamos se é o nosso frontend
      const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Opcional: callback(new Error('Bloqueado pelo CORS'));
        // Para dev, pode liberar:
        callback(null, true);
      }
    },
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
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server rodando na porta ${PORT}`),
);
