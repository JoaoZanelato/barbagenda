import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { AuthController } from "../controllers/AuthController";
import { MobileAuthController } from "../controllers/MobileAuthController"; // <--- NOVO
import { ServiceController } from "../controllers/ServiceController";
import { ProfessionalController } from "../controllers/ProfessionalController";
import { AvailabilityController } from "../controllers/AvailabilityController";
import { AppointmentController } from "../controllers/AppointmentController";
import { TenantController } from "../controllers/TenantController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureMobileAuth } from "../middlewares/ensureMobileAuth"; // <--- NOVO
import { prisma } from "../prisma/client";

const router = Router();

// Controllers Web
const dashboardController = new DashboardController();
const authController = new AuthController();
const serviceController = new ServiceController();
const professionalController = new ProfessionalController();
const availabilityController = new AvailabilityController();
const appointmentController = new AppointmentController();
const tenantController = new TenantController();
// Controller Mobile
const mobileAuthController = new MobileAuthController(); // <--- NOVO

// ==========================================================
// 🔓 ROTAS PÚBLICAS (WEB & APP)
// ==========================================================

// Web Admin Login
router.post("/login", authController.handle);
router.post("/tenants", tenantController.store);

// App Mobile Auth
router.post("/mobile/register", mobileAuthController.register);
router.post("/mobile/login", mobileAuthController.login);

// App Mobile - Listagem Pública
router.get("/mobile/tenants", async (req, res) => {
  // Lista barbearias para o usuário escolher
  const tenants = await prisma.tenants.findMany({
    select: { id: true, name: true, slug: true },
  });
  return res.json(tenants);
});

// App Mobile - Dados da Barbearia Selecionada
router.get("/mobile/tenants/:id/details", async (req, res) => {
  const { id } = req.params;
  // Busca Profissionais e Serviços daquela barbearia
  const pros = await prisma.users.findMany({
    where: { tenant_id: id, role: "barber" },
    select: { id: true, name: true },
  });
  const services = await prisma.services.findMany({
    where: { tenant_id: id, active: true },
  });

  return res.json({ professionals: pros, services });
});

// Disponibilidade (Público para consulta)
router.get("/disponibilidade", availabilityController.handle);

// ==========================================================
// 📱 ROTAS PRIVADAS DO APP (Requer Login com PIN)
// ==========================================================
// Agora o agendamento pega o telefone do token JWT
router.post("/mobile/appointments", ensureMobileAuth, async (req, res) => {
  // Wrapper para injetar o telefone autenticado no controller original
  req.body.customerPhone = req.body.authenticatedPhone;
  return appointmentController.createBatch(req, res);
});

// ==========================================================
// 🔒 ROTAS PRIVADAS WEB (Painel Admin)
// ==========================================================
router.use(ensureAuthenticated);

router.get("/tenants", tenantController.index);
router.post("/services", serviceController.create);
router.get("/services", serviceController.list);
router.delete("/services/:id", serviceController.delete);
router.post("/professionals", professionalController.create);
router.get("/professionals", professionalController.list);
router.delete("/professionals/:id", professionalController.delete);
router.get("/appointments", appointmentController.index);
router.post("/appointments", appointmentController.store);
router.patch("/appointments/:id", appointmentController.update);
router.get("/dashboard/metrics", dashboardController.index);

export { router };
