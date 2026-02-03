import { Router } from "express";
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

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureMobileAuth } from "../middlewares/ensureMobileAuth";
import { prisma } from "../prisma/client";

const router = Router();

// --- Instanciar Controllers ---
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

// ==========================================================
// 🔓 ROTAS PÚBLICAS
// ==========================================================

// Web Admin Login
router.post("/login", authController.handle);
router.post("/tenants", tenantController.store);

// App Mobile Auth
router.post("/mobile/register", mobileAuthController.register);
router.post("/mobile/login", mobileAuthController.login);

// App Mobile - Listagem de Barbearias (Pública)
router.get("/mobile/tenants", async (req, res) => {
  const tenants = await prisma.tenants.findMany({
    select: { id: true, name: true, slug: true },
  });
  return res.json(tenants);
});

// App Mobile - Dados da Barbearia Selecionada (Serviços e Profissionais)
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

// Disponibilidade (Usada tanto no Web quanto no Mobile)
router.get("/disponibilidade", availabilityController.handle);

// ==========================================================
// 📱 ROTAS PRIVADAS DO APP (Mobile - Cliente)
// ==========================================================
// Todas estas rotas exigem o token do Cliente (ensureMobileAuth)

// Perfil do Usuário (Novo)
router.get("/mobile/profile", ensureMobileAuth, mobileAuthController.me);
router.delete("/mobile/profile", ensureMobileAuth, mobileAuthController.delete);

// Criar Agendamento
router.post("/mobile/appointments", ensureMobileAuth, async (req, res) => {
  return appointmentController.store(req, res);
});

// Meus Agendamentos (Histórico)
router.get(
  "/mobile/my-appointments",
  ensureMobileAuth,
  appointmentController.listMobile,
);

// Cancelar Agendamento
router.patch(
  "/mobile/appointments/:id/cancel",
  ensureMobileAuth,
  appointmentController.cancelMobile,
);

// Favoritos (Listar e Toggle)
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

// Salvar Token de Notificação (Push)
router.post(
  "/mobile/notifications/token",
  ensureMobileAuth,
  notificationController.saveClientToken,
);

// ==========================================================
// 🔒 ROTAS PRIVADAS WEB (Painel do Barbeiro/Admin)
// ==========================================================
// Todas estas rotas exigem o token do Barbeiro (ensureAuthenticated)
router.use(ensureAuthenticated);

// Salvar token de notificação do barbeiro
router.post("/notifications/token", notificationController.saveBarberToken);

// Dashboard (Métricas)
router.get("/dashboard/metrics", dashboardController.index);

// Tenants (Dados da Barbearia)
router.get("/tenants", tenantController.index);

// Atualizar Token Push (Genérico)
router.patch("/users/push-token", async (req, res) => {
  const { token } = req.body;
  const user_id = req.user_id;

  if (!token) return res.status(400).json({ error: "Token não enviado" });

  await prisma.users.update({
    where: { id: user_id },
    data: { push_token: token },
  });

  return res.status(200).send();
});

// Serviços (CRUD)
router.post("/services", serviceController.create);
router.get("/services", serviceController.list);
router.delete("/services/:id", serviceController.delete);

// Profissionais (CRUD)
router.post("/professionals", professionalController.create);
router.get("/professionals", professionalController.list);
router.delete("/professionals/:id", professionalController.delete);

// Agendamentos (Gestão pelo Barbeiro)
router.get("/appointments", appointmentController.index);
router.post("/appointments", appointmentController.store);
router.patch("/appointments/:id", appointmentController.update);

export { router };
