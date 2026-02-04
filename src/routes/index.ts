import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";

import { DashboardController } from "../controllers/DashboardController";
import { AuthController } from "../controllers/AuthController";
import { MobileAuthController } from "../controllers/MobileAuthController";
import { ServiceController } from "../controllers/ServiceController";
import { ProfessionalController } from "../controllers/ProfessionalController";
import { AvailabilityController } from "../controllers/AvailabilityController";
import { AppointmentController } from "../controllers/AppointmentController";
import { TenantController } from "../controllers/TenantController";
import { NotificationController } from "../controllers/NotificationController";
import { MobileFavoriteController } from "../controllers/MobileFavoriteController";
import { ReviewController } from "../controllers/ReviewController"; // 👈 Importe

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureMobileAuth } from "../middlewares/ensureMobileAuth";
import { prisma } from "../prisma/client";

const router = Router();

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
const reviewController = new ReviewController(); // 👈 Instância

// === ROTAS PÚBLICAS ===
router.post("/login", authController.handle);
router.post("/tenants", tenantController.store);
router.post("/mobile/register", mobileAuthController.register);
router.post("/mobile/login", mobileAuthController.login);

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Arquivo inválido" });
  const fullUrl = `${req.protocol}://${req.get("host")}/files/${req.file.filename}`;
  return res.json({ url: fullUrl });
});

router.get("/mobile/tenants", tenantController.index);
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
    return res.status(500).json({ error: "Erro" });
  }
});
router.get("/disponibilidade", availabilityController.handle);

// === ROTAS PRIVADAS MOBILE (CLIENTE) ===
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

router.get("/mobile/profile", ensureMobileAuth, mobileAuthController.me);
router.put("/mobile/profile", ensureMobileAuth, mobileAuthController.update);
router.delete("/mobile/profile", ensureMobileAuth, mobileAuthController.delete);

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

// 👇 NOVAS ROTAS DE AVALIAÇÃO
router.post("/mobile/reviews", ensureMobileAuth, reviewController.store);
router.get(
  "/mobile/reviews/:tenant_id",
  ensureMobileAuth,
  reviewController.list,
);

// === ROTAS PRIVADAS WEB (BARBEIRO) ===
router.use(ensureAuthenticated);

router.post("/notifications/token", notificationController.saveBarberToken);
router.delete("/notifications/token", notificationController.removeBarberToken);

router.get("/dashboard/metrics", dashboardController.index);
router.get("/tenants", tenantController.index);
router.put("/tenants/profile", tenantController.update);

router.post("/services", serviceController.create);
router.get("/services", serviceController.list);
router.delete("/services/:id", serviceController.delete);

router.post("/professionals", professionalController.create);
router.get("/professionals", professionalController.list);
router.delete("/professionals/:id", professionalController.delete);

router.get("/appointments", appointmentController.index);
router.post("/appointments", appointmentController.store);
router.patch("/appointments/:id", appointmentController.update);

export { router };
