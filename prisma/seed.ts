import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed (Apenas Super Admin)...");

  // Senha padrão
  const passwordHash = await hash("123456", 8);

  // Cria APENAS o Usuário Super Admin (Sem Barbearia vinculada)
  const adminUser = await prisma.users.upsert({
    where: { email: "admin@saas.com" },
    update: {
      password_hash: passwordHash, // Reseta a senha se rodar de novo
      role: "super_admin", // Garante o cargo correto
      // Não alteramos o tenant_id no update para não quebrar se você decidir vincular manualmente depois
    },
    create: {
      name: "Master Super Admin",
      email: "admin@saas.com",
      password_hash: passwordHash,
      phone: "5554999999999",
      role: "super_admin",
      active: true,
      tenant_id: null, // 👈 O segredo: Ele não tem barbearia, é null
    },
  });

  console.log(`✅ Seed executado com sucesso!`);
  console.log(`👤 Usuário: ${adminUser.name}`);
  console.log(`📧 Email:   admin@saas.com`);
  console.log(`🔑 Senha:   123456`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao rodar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
