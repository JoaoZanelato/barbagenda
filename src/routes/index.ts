import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { AuthController } from "../controllers/AuthController";
import { ServiceController } from "../controllers/ServiceController";
import { ProfessionalController } from "../controllers/ProfessionalController";
import { AvailabilityController } from "../controllers/AvailabilityController";
import { AppointmentController } from "../controllers/AppointmentController";
import { WhatsappController } from "../controllers/WhatsappController";
import { TenantController } from "../controllers/TenantController"; // <--- NOVO
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { prisma } from "../prisma/client";

const router = Router();

const dashboardController = new DashboardController();
const authController = new AuthController();
const serviceController = new ServiceController();
const professionalController = new ProfessionalController();
const availabilityController = new AvailabilityController();
const appointmentController = new AppointmentController();
const whatsappController = new WhatsappController();
const tenantController = new TenantController(); // <--- NOVO

// ==========================================================
// 🔓 ROTAS PÚBLICAS
// ==========================================================

router.post("/login", authController.handle);
router.post("/tenants", tenantController.store); // <--- Rota de Cadastro (Signup)
router.post("/webhook/twilio", (req, res) =>
  whatsappController.handle(req, res),
);
router.get("/", (req, res) => res.json({ status: "API Online 🚀" }));

router.get("/disponibilidade", availabilityController.handle);

router.get("/barbearia/:slug/servicos", async (req, res) => {
  const { slug } = req.params;
  const barbearia = await prisma.tenants.findUnique({
    where: { slug },
    include: { services: true },
  });
  return res.json(barbearia);
});

// ==========================================================
// 🔒 ROTAS PRIVADAS
// ==========================================================
router.use(ensureAuthenticated);

// 1. Administração Geral
router.get("/tenants", tenantController.index); // <--- Listar todas (Seu Painel)

// 2. Serviços
router.post("/services", serviceController.create);
router.get("/services", serviceController.list);
router.delete("/services/:id", serviceController.delete);

// 3. Profissionais
router.post("/professionals", professionalController.create);
router.get("/professionals", professionalController.list);
router.delete("/professionals/:id", professionalController.delete);

// 4. Agendamentos
router.get("/appointments", appointmentController.index);
router.post("/appointments", appointmentController.store);
router.patch("/appointments/:id", appointmentController.update);

// 5. Métricas
router.get("/dashboard/metrics", dashboardController.index);

export { router };
