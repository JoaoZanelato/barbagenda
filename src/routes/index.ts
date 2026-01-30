import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { AuthController } from "../controllers/AuthController";
import { MobileAuthController } from "../controllers/MobileAuthController";
import { ServiceController } from "../controllers/ServiceController";
import { ProfessionalController } from "../controllers/ProfessionalController";
import { AvailabilityController } from "../controllers/AvailabilityController";
import { AppointmentController } from "../controllers/AppointmentController";
import { TenantController } from "../controllers/TenantController";
import { NotificationController } from "../controllers/NotificationController"; // 👈 NOVO
import { ensureAuthenticated } from "../controllers/middlewares/ensureAuthenticated";
import { ensureMobileAuth } from "../controllers/middlewares/ensureMobileAuth";
import { prisma } from "../prisma/client";

const router = Router();

// Instanciar Controllers
const dashboardController = new DashboardController();
const authController = new AuthController();
const serviceController = new ServiceController();
const professionalController = new ProfessionalController();
const availabilityController = new AvailabilityController();
const appointmentController = new AppointmentController();
const tenantController = new TenantController();
const mobileAuthController = new MobileAuthController();
const notificationController = new NotificationController(); // 👈 NOVO

// ==========================================================
// 🔓 ROTAS PÚBLICAS
// ==========================================================

// Web Admin Login
router.post("/login", authController.handle);
router.post("/tenants", tenantController.store);

// App Mobile Auth
router.post("/mobile/register", mobileAuthController.register);
router.post("/mobile/login", mobileAuthController.login);

// App Mobile - Listagem de Barbearias
router.get("/mobile/tenants", async (req, res) => {
  const tenants = await prisma.tenants.findMany({
    select: { id: true, name: true, slug: true },
  });
  return res.json(tenants);
});

// App Mobile - Dados da Barbearia Selecionada
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

// Disponibilidade
router.get("/disponibilidade", availabilityController.handle);

// ==========================================================
// 📱 ROTAS PRIVADAS DO APP (Mobile)
// ==========================================================
router.post("/mobile/appointments", ensureMobileAuth, async (req, res) => {
  return appointmentController.store(req, res);
});

// 👇 ROTA NOVA: Salvar token do cliente
router.post(
  "/mobile/notifications/token",
  ensureMobileAuth,
  notificationController.saveClientToken,
);

// ==========================================================
// 🔒 ROTAS PRIVADAS WEB/BARBEIRO
// ==========================================================
router.use(ensureAuthenticated);

// 👇 ROTA NOVA: Salvar token do barbeiro
router.post("/notifications/token", notificationController.saveBarberToken);

// Dashboard
router.get("/dashboard/metrics", dashboardController.index);

// Tenants
router.get("/tenants", tenantController.index);

// Serviços
router.post("/services", serviceController.create);
router.get("/services", serviceController.list);
router.delete("/services/:id", serviceController.delete);

// Profissionais
router.post("/professionals", professionalController.create);
router.get("/professionals", professionalController.list);
router.delete("/professionals/:id", professionalController.delete);

// Agendamentos
router.get("/appointments", appointmentController.index);
router.post("/appointments", appointmentController.store);
router.patch("/appointments/:id", appointmentController.update);

export { router };
