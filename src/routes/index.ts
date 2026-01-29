import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { AuthController } from "../controllers/AuthController"; // 👈 TEM QUE TER AS CHAVES { }
import { MobileAuthController } from "../controllers/MobileAuthController";
import { ServiceController } from "../controllers/ServiceController";
import { ProfessionalController } from "../controllers/ProfessionalController";
import { AvailabilityController } from "../controllers/AvailabilityController";
import { AppointmentController } from "../controllers/AppointmentController";
import { TenantController } from "../controllers/TenantController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureMobileAuth } from "../middlewares/ensureMobileAuth";
import { prisma } from "../prisma/client";

const router = Router();

// Instanciar Controllers
const dashboardController = new DashboardController();
const authController = new AuthController(); // 👈 O erro estava aqui
const serviceController = new ServiceController();
const professionalController = new ProfessionalController();
const availabilityController = new AvailabilityController();
const appointmentController = new AppointmentController();
const tenantController = new TenantController();
const mobileAuthController = new MobileAuthController();

// ==========================================================
// 🔓 ROTAS PÚBLICAS
// ==========================================================

// Web Admin Login
router.post("/login", authController.handle);
router.post("/tenants", tenantController.store);

// App Mobile Auth
router.post("/mobile/register", mobileAuthController.register);
router.post("/mobile/login", mobileAuthController.login);

// App Mobile - Listagem Pública
router.get("/mobile/tenants", async (req, res) => {
  const tenants = await prisma.tenants.findMany({
    select: { id: true, name: true, slug: true },
  });
  return res.json(tenants);
});

// App Mobile - Dados da Barbearia
// App Mobile - Dados da Barbearia Selecionada
router.get("/mobile/tenants/:id/details", async (req, res) => {
  const { id } = req.params;

  // Busca APENAS Profissionais com cargo 'barber' e que estão ATIVOS
  const pros = await prisma.users.findMany({
    where: {
      tenant_id: id,
      role: "barber", // Garante que Admin não aparece
      active: true, // Garante que demitidos não aparecem
    },
    select: { id: true, name: true },
  });

  const services = await prisma.services.findMany({
    where: { tenant_id: id, active: true },
  });

  return res.json({ professionals: pros, services });
});

// Disponibilidade
router.get("/disponibilidade", availabilityController.handle);

// ==========================================================
// 📱 ROTAS PRIVADAS DO APP (Mobile)
// ==========================================================
router.post("/mobile/appointments", ensureMobileAuth, async (req, res) => {
  req.body.customerPhone = req.body.authenticatedPhone;
  return appointmentController.createBatch(req, res);
});

// ==========================================================
// 🔒 ROTAS PRIVADAS WEB (Admin)
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
