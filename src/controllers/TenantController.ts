import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hash } from "bcryptjs";

export class TenantController {
  // 1. LISTAGEM PARA O APP (Pública)
  async index(req: Request, res: Response) {
    const tenants = await prisma.tenants.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        // 👇 Novos campos de Perfil e Endereço
        logo_url: true,
        cover_url: true,
        phone: true, // WhatsApp
        address: true, // Rua
        address_num: true,
        neighborhood: true,
        city: true,
        state: true,
        latitude: true, // Para o Mapa
        longitude: true, // Para o Mapa
      },
    });

    return res.json(tenants);
  }

  // 2. CRIAÇÃO (SaaS Admin)
  async store(req: Request, res: Response) {
    const { name, slug, email, password, phone } = req.body;

    // Verifica se já existe email ou slug
    const tenantExists = await prisma.tenants.findUnique({ where: { slug } });
    const userExists = await prisma.users.findUnique({ where: { email } });

    if (tenantExists || userExists) {
      return res.status(400).json({ error: "Slug ou Email já em uso." });
    }

    const passwordHash = await hash(password, 8);

    // Cria Tenant e Usuário Admin em uma transação
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
  }

  // 3. ATUALIZAR PERFIL DA BARBEARIA (Novo - Para a página de Configuração)
  async update(req: Request, res: Response) {
    const tenant_id = req.tenant_id; // Vem do token do admin logado
    const data = req.body;

    // Filtra apenas campos permitidos para atualização
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
    } = data;

    try {
      const tenant = await prisma.tenants.update({
        where: { id: tenant_id },
        data: {
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
      return res
        .status(400)
        .json({ error: "Erro ao atualizar perfil da barbearia." });
    }
  }
}
