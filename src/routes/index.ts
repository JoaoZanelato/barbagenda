import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { ServiceController } from "../controllers/ServiceController";
import { ProfessionalController } from "../controllers/ProfessionalController"; // <--- NOVO
import { AvailabilityController } from "../controllers/AvailabilityController";
import { AppointmentController } from "../controllers/AppointmentController";
import { WhatsappController } from "../controllers/WhatsappController";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { prisma } from "../prisma/client";

const router = Router();

const authController = new AuthController();
const serviceController = new ServiceController();
const professionalController = new ProfessionalController(); // <--- NOVO
const availabilityController = new AvailabilityController();
const appointmentController = new AppointmentController();
const whatsappController = new WhatsappController();

// ==========================================================
// 🔓 ROTAS PÚBLICAS
// ==========================================================

router.post("/login", authController.handle);
router.post("/webhook/twilio", (req, res) =>
  whatsappController.receive(req, res),
);
router.get("/", (req, res) => res.json({ status: "API Online 🚀" }));

// Agendamento (Cliente Final)
router.get("/disponibilidade", availabilityController.handle);
router.post("/agendamento", appointmentController.handle);

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

// 2. Profissionais (NOVO)
router.post("/professionals", professionalController.create);
router.get("/professionals", professionalController.list);
router.delete("/professionals/:id", professionalController.delete);

export { router };
