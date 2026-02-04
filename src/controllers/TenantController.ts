import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hash } from "bcryptjs";
import { deleteFile } from "../utils/file"; // 👈 Lógica de limpeza mantida

export class TenantController {
  // 1. LISTAGEM PARA O APP (Mantida sua lógica original com select específico)
  async index(req: Request, res: Response) {
    const tenants = await prisma.tenants.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        logo_url: true,
        phone: true,
        address: true,
        address_num: true,
        neighborhood: true,
        city: true,
        state: true,
        latitude: true,
        longitude: true,
      },
    });

    return res.json(tenants);
  }

  // 2. CRIAÇÃO (Mantida sua lógica robusta com Transaction)
  async store(req: Request, res: Response) {
    const { name, slug, email, password, phone } = req.body;

    // Validações
    const tenantExists = await prisma.tenants.findUnique({ where: { slug } });
    const userExists = await prisma.users.findUnique({ where: { email } });

    if (tenantExists || userExists) {
      return res.status(400).json({ error: "Slug ou Email já em uso." });
    }

    const passwordHash = await hash(password, 8);

    try {
      // Cria Tenant e Admin juntos
      const result = await prisma.$transaction(async (prisma) => {
        const tenant = await prisma.tenants.create({
          data: { name, slug, phone },
        });

        const user = await prisma.users.create({
          data: {
            name,
            email,
            password_hash: passwordHash,
            tenant_id: tenant.id,
            role: "admin",
            phone,
          },
        });

        return { tenant, user };
      });

      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar barbearia." });
    }
  }

  // 3. ATUALIZAR (Sua lógica + Delete de imagem antiga)
  async update(req: Request, res: Response) {
    // O tenant_id vem do middleware ensureAuthenticated (que popula o req)
    const tenant_id = req.tenant_id;
    const data = req.body;

    // Seus campos permitidos
    const {
      logo_url,
      cover_url,
      description,
      phone,
      address,
      address_num,
      neighborhood,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      name, // Adicionei name caso queira editar o nome da loja
    } = data;

    try {
      // 1. Busca a barbearia ATUAL para pegar a logo antiga
      const currentTenant = await prisma.tenants.findUnique({
        where: { id: tenant_id },
      });

      if (!currentTenant) {
        return res.status(404).json({ error: "Barbearia não encontrada" });
      }

      // 2. Verifica se precisa deletar a logo antiga (Lógica Nova)
      if (
        currentTenant.logo_url &&
        logo_url &&
        currentTenant.logo_url !== logo_url
      ) {
        await deleteFile(currentTenant.logo_url); // 🗑️ Apaga a velha
      }

      // 3. Atualiza com os campos filtrados
      const tenant = await prisma.tenants.update({
        where: { id: tenant_id },
        data: {
          name,
          logo_url,
          cover_url,
          description,
          phone,
          address,
          address_num,
          neighborhood,
          city,
          state,
          zip_code,
          latitude,
          longitude,
        },
      });

      return res.json(tenant);
    } catch (error) {
      console.error("Erro update tenant:", error);
      return res
        .status(400)
        .json({ error: "Erro ao atualizar perfil da barbearia." });
    }
  }
}
