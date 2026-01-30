import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // 1. Cria a Barbearia "Mestra" (SaaS Admin)
  // Isso serve para você ter um painel global caso queira gerenciar as outras barbearias depois
  const adminTenant = await prisma.tenants.upsert({
    where: { slug: "admin-saas" },
    update: {}, // Se já existir, não faz nada
    create: {
      name: "SaaS Admin",
      slug: "admin-saas",
      plan_status: "active",
      // Cria um horário padrão apenas para evitar erros de integridade
      operating_hours: {
        create: { day_of_week: 1, open_time: "08:00", close_time: "18:00" },
      },
    },
  });

  // 2. Cria o Usuário Super Admin
  const passwordHash = await hash("123456", 8); // 👈 Senha padrão: 123456

  const adminUser = await prisma.users.upsert({
    where: { email: "admin@saas.com" },
    update: {
      role: "super_admin",
      password_hash: passwordHash, // Garante que a senha reseta para 123456 se rodar o seed
    },
    create: {
      name: "João Zanelato",
      email: "admin@saas.com",
      phone: "5554999999999", // Telefone fictício
      password_hash: passwordHash,
      role: "super_admin",
      tenant_id: adminTenant.id,
      active: true,
    },
  });

  console.log(`✅ Seed executado com sucesso!`);
  console.log(`-----------------------------------`);
  console.log(`👤 Usuário: ${adminUser.name}`);
  console.log(`📧 Email:   admin@saas.com`);
  console.log(`🔑 Senha:   123456`);
  console.log(`-----------------------------------`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
