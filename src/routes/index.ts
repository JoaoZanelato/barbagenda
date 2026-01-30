import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { AuthController } from "../controllers/AuthController";
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
const authController = new AuthController();
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

// Disponibilidade (Público ou Privado, dependendo da regra)
router.get("/disponibilidade", availabilityController.handle);

// ==========================================================
// 📱 ROTAS PRIVADAS DO APP (Mobile)
// ==========================================================
router.post("/mobile/appointments", ensureMobileAuth, async (req, res) => {
  // Injeta o telefone autenticado se necessário, ou usa a lógica do controller
  // Chama o método .store (que unificamos)
  return appointmentController.store(req, res);
});

// ==========================================================
// 🔒 ROTAS PRIVADAS WEB (Admin)
// ==========================================================
router.use(ensureAuthenticated);

// Dashboard
router.get("/dashboard/metrics", dashboardController.index);

// Tenants (Super Admin)
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
router.get("/appointments", appointmentController.index); // Agora existe!
router.post("/appointments", appointmentController.store); // Agora existe!
router.patch("/appointments/:id", appointmentController.update); // Agora existe!

export { router };
