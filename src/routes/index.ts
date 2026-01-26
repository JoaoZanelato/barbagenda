import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { AuthController } from "../controllers/AuthController";
import { ServiceController } from "../controllers/ServiceController";
import { ProfessionalController } from "../controllers/ProfessionalController";
import { AvailabilityController } from "../controllers/AvailabilityController";
import { AppointmentController } from "../controllers/AppointmentController";
import { WhatsappController } from "../controllers/WhatsappController";
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

// ==========================================================
// 🔓 ROTAS PÚBLICAS
// ==========================================================

router.post("/login", authController.handle);
router.post("/webhook/twilio", (req, res) =>
  whatsappController.handle(req, res),
); // Ajustei para .handle se for o do Bot
router.get("/", (req, res) => res.json({ status: "API Online 🚀" }));

// Agendamento (Cliente Final - Disponibilidade)
router.get("/disponibilidade", availabilityController.handle);

// Consultas Públicas (App/Site)
router.get("/barbearia/:slug/servicos", async (req, res) => {
  const { slug } = req.params;
  const barbearia = await prisma.tenants.findUnique({
    where: { slug },
    include: { services: true },
  });
  return res.json(barbearia);
});

// ==========================================================
// 🔒 ROTAS PRIVADAS (Painel Admin)
// ==========================================================
router.use(ensureAuthenticated);

// 1. Serviços
router.post("/services", serviceController.create);
router.get("/services", serviceController.list);
router.delete("/services/:id", serviceController.delete);

// 2. Profissionais
router.post("/professionals", professionalController.create);
router.get("/professionals", professionalController.list);
router.delete("/professionals/:id", professionalController.delete);

// 3. Agendamentos (Dashboard) <--- ADICIONE ISTO AQUI
router.get("/appointments", appointmentController.index); // Listar no painel
router.post("/appointments", appointmentController.store); // Criar manual
router.patch("/appointments/:id", appointmentController.update); // Mudar status

// 4. Métricas
router.get("/dashboard/metrics", dashboardController.index);

export { router };
