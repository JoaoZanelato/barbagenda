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
// App Mobile - Dados da Barbearia Selecionada
router.get("/mobile/tenants/:id/details", async (req, res) => {
  const { id } = req.params;

  console.log(`[DEBUG CLIENTE] Buscando dados da barbearia ID: ${id}`);

  try {
    // 1. Busca Profissionais (Barbeiros Ativos)
    const pros = await prisma.users.findMany({
      where: {
        tenant_id: id,
        role: "barber", // Apenas barbeiros
        active: true, // Apenas ativos (evita deletados/soft-delete)
      },
      select: { id: true, name: true },
    });

    console.log(`[DEBUG CLIENTE] Barbeiros encontrados: ${pros.length}`, pros);

    // 2. Busca Serviços (Ativos)
    const services = await prisma.services.findMany({
      where: {
        tenant_id: id,
        active: true,
      },
      orderBy: { name: "asc" },
    });

    console.log(`[DEBUG CLIENTE] Serviços encontrados: ${services.length}`);

    return res.json({ professionals: pros, services });
  } catch (error) {
    console.error("[DEBUG ERROR]", error);
    return res.status(500).json({ error: "Erro ao buscar detalhes" });
  }
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
