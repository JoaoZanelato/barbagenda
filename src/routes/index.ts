import { Router } from "express";
import { AvailabilityController } from "../controllers/AvailabilityController";
import { AppointmentController } from "../controllers/AppointmentController";
import { WhatsappController } from "../controllers/WhatsappController";
import { prisma } from "../prisma/client";

const router = Router();

const availabilityController = new AvailabilityController();
const appointmentController = new AppointmentController();
const whatsappController = new WhatsappController();

// Rotas de Agendamento
router.get("/disponibilidade", availabilityController.handle);
router.post("/agendamento", appointmentController.handle);

// Rotas Simples (Podem virar Controller depois)
router.get("/", (req, res) => res.json({ status: "API Online 🚀" }));

router.get("/barbearia/:slug/servicos", async (req, res) => {
  const { slug } = req.params;
  const barbearia = await prisma.tenants.findUnique({
    where: { slug },
    include: { services: true },
  });
  return res.json(barbearia);
});

router.get("/users", async (req, res) => {
  const users = await prisma.users.findMany();
  return res.json(users);
});

// ========================================
// WEBHOOKS DO WHATSAPP
// ========================================

// Meta WhatsApp Business API (antigo - mantido para referência)
router.get("/webhook", whatsappController.verify);
router.post("/webhook", whatsappController.receive);

// Twilio WhatsApp API (novo - recomendado)
router.post("/webhook/twilio", (req, res) =>
  whatsappController.receive(req, res),
);

export { router };
