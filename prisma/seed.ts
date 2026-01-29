import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // 1. Cria a Barbearia "Mestra" (SaaS Admin)
  // Usamos um UUID fixo para facilitar
  const adminTenant = await prisma.tenants.upsert({
    where: { slug: "admin-saas" },
    update: {},
    create: {
      name: "SaaS Admin",
      slug: "admin-saas", // Slug reservado
      plan_status: "active",
      // Cria horários padrão só para não dar erro
      operating_hours: {
        create: { day_of_week: 1, open_time: "08:00", close_time: "18:00" },
      },
    },
  });

  // 2. Cria o Seu Usuário (Super Admin)
  const passwordHash = await hash("123456", 8); // Senha padrão: 123456

  const adminUser = await prisma.users.upsert({
    where: { email: "admin@saas.com" }, // Seu email de login
    update: { role: "super_admin" }, // Garante que é super_admin
    create: {
      name: "João Zanelato",
      email: "admin@saas.com",
      phone: "5554996303319", // Seu telefone
      password_hash: passwordHash,
      role: "super_admin", 
      tenant_id: adminTenant.id,
    },
  });

  console.log(`✅ Super Admin criado!`);
  console.log(`📧 Login: admin@saas.com`);
  console.log(`🔑 Senha: 123456`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
