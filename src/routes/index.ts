import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";

// Importação dos Controllers
import { DashboardController } from "../controllers/DashboardController";
import { AuthController } from "../controllers/AuthController";
import { MobileAuthController } from "../controllers/MobileAuthController";
import { ServiceController } from "../controllers/ServiceController";
import { ProfessionalController } from "../controllers/ProfessionalController";
import { AvailabilityController } from "../controllers/AvailabilityController"; // <--- Importante
import { AppointmentController } from "../controllers/AppointmentController";
import { TenantController } from "../controllers/TenantController";
import { NotificationController } from "../controllers/NotificationController";
import { MobileFavoriteController } from "../controllers/MobileFavoriteController";
import { ReviewController } from "../controllers/ReviewController";

// Middlewares
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureMobileAuth } from "../middlewares/ensureMobileAuth";
import { prisma } from "../prisma/client";

const router = Router();

// Configuração do Multer (Upload de Imagens)
const uploadFolder = path.resolve(__dirname, "..", "..", "uploads");
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;
      return callback(null, fileName);
    },
  }),
});

// Instâncias dos Controllers
const dashboardController = new DashboardController();
const authController = new AuthController();
const serviceController = new ServiceController();
const professionalController = new ProfessionalController();
const availabilityController = new AvailabilityController();
const appointmentController = new AppointmentController();
const tenantController = new TenantController();
const mobileAuthController = new MobileAuthController();
const notificationController = new NotificationController();
const mobileFavoriteController = new MobileFavoriteController();
const reviewController = new ReviewController();

// ==========================================================
// 🌍 ROTAS PÚBLICAS (Sem Autenticação)
// ==========================================================

// Login Administrativo (Barbeiro/Web)
router.post("/login", authController.handle);

// Registro e Login Mobile (Cliente)
router.post("/mobile/register", mobileAuthController.register);
router.post("/mobile/login", mobileAuthController.login);

// Criação de Tenant (Barbearia) - Geralmente usado no cadastro inicial
router.post("/tenants", tenantController.store);

// Upload de Arquivos
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Arquivo inválido" });
  const fullUrl = `${req.protocol}://${req.get("host")}/files/${req.file.filename}`;
  return res.json({ url: fullUrl });
});

// Listagem Pública de Barbearias (Para o App antes do login ou Home)
router.get("/mobile/tenants", tenantController.index);

// Detalhes da Barbearia (Público para carregar perfil antes de agendar)
router.get("/mobile/tenants/:id/details", async (req, res) => {
  const { id } = req.params;
  try {
    const pros = await prisma.users.findMany({
      where: { tenant_id: id, role: "barber", active: true },
      select: { id: true, name: true },
    });
    const services = await prisma.services.findMany({
      where: { tenant_id: id, active: true },
      orderBy: { name: "asc" },
    });
    return res.json({ professionals: pros, services });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar detalhes" });
  }
});

// Disponibilidade de Horários (Slots livres para o cliente escolher)
router.get("/disponibilidade", availabilityController.handle);

// ==========================================================
// 📱 ROTAS PRIVADAS MOBILE (CLIENTE)
// ==========================================================
// Todas as rotas abaixo exigem Token do Cliente

// Notificações (Push Token)
router.post(
  "/mobile/notifications/token",
  ensureMobileAuth,
  notificationController.saveClientToken,
);
router.delete(
  "/mobile/notifications/token",
  ensureMobileAuth,
  notificationController.removeClientToken,
);

// Perfil do Cliente
router.get("/mobile/profile", ensureMobileAuth, mobileAuthController.me);
router.put("/mobile/profile", ensureMobileAuth, mobileAuthController.update);
router.delete("/mobile/profile", ensureMobileAuth, mobileAuthController.delete);

// Agendamentos (Cliente)
router.post("/mobile/appointments", ensureMobileAuth, (req, res) =>
  appointmentController.store(req, res),
);
router.get(
  "/mobile/my-appointments",
  ensureMobileAuth,
  appointmentController.listMobile,
);
router.patch(
  "/mobile/appointments/:id/cancel",
  ensureMobileAuth,
  appointmentController.cancelMobile,
);

// Favoritos
router.get(
  "/mobile/favorites",
  ensureMobileAuth,
  mobileFavoriteController.index,
);
router.post(
  "/mobile/favorites/:tenantId/toggle",
  ensureMobileAuth,
  mobileFavoriteController.toggle,
);

// Avaliações (Reviews)
router.post("/mobile/reviews", ensureMobileAuth, reviewController.store);
router.get(
  "/mobile/reviews/:tenant_id",
  ensureMobileAuth,
  reviewController.list,
);

// ==========================================================
// 💻 ROTAS PRIVADAS WEB (BARBEIRO / ADMIN)
// ==========================================================
// Todas as rotas abaixo exigem Token de Barbeiro/Admin
router.use(ensureAuthenticated);

// Notificações (Barbeiro)
router.post("/notifications/token", notificationController.saveBarberToken);
router.delete("/notifications/token", notificationController.removeBarberToken);

// Dashboard & Métricas
router.get("/dashboard/metrics", dashboardController.handle); // Alterado de .index para .handle conforme seu controller

// Configuração da Loja (Tenant)
router.get("/tenants", tenantController.index);
router.put("/tenants/profile", tenantController.update);

// Configuração de Disponibilidade (Horários de Trabalho) - NOVO!
router.get("/availability", availabilityController.index); // Ver configuração atual
router.put("/availability", availabilityController.update); // Salvar nova configuração

// Gestão de Serviços
router.get("/services", serviceController.index); // ou .list dependendo do seu controller
router.post("/services", serviceController.create);
router.delete("/services/:id", serviceController.delete);

// Gestão de Profissionais
router.get("/professionals", professionalController.index); // ou .list
router.post("/professionals", professionalController.create);
router.delete("/professionals/:id", professionalController.delete);

// Gestão de Agendamentos (Agenda do Barbeiro)
router.get("/appointments", appointmentController.list); // ou .index
router.post("/appointments", appointmentController.create); // ou .store
router.patch("/appointments/:id", appointmentController.updateStatus); // ou .update

export { router };
