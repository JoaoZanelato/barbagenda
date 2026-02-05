import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { hash } from "bcryptjs";
import { deleteFile } from "../utils/file";

export class TenantController {
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

  async store(req: Request, res: Response) {
    const { name, slug, email, password, phone } = req.body;
    const tenantExists = await prisma.tenants.findUnique({ where: { slug } });
    const userExists = await prisma.users.findUnique({ where: { email } });

    if (tenantExists || userExists)
      return res.status(400).json({ error: "Slug ou Email já em uso." });

    const passwordHash = await hash(password, 8);

    try {
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
      return res.status(500).json({ error: "Erro ao criar barbearia." });
    }
  }

  async update(req: Request, res: Response) {
    // 👇 CORREÇÃO CRÍTICA: Garante que pega o ID de onde estiver disponível
    const tenant_id = req.tenant_id || (req.user && req.user.tenant_id);

    if (!tenant_id) {
      return res.status(401).json({ error: "ID da barbearia não encontrado." });
    }

    const data = req.body;
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
      name,
    } = data;

    try {
      const currentTenant = await prisma.tenants.findUnique({
        where: { id: tenant_id },
      });
      if (!currentTenant)
        return res.status(404).json({ error: "Barbearia não encontrada" });

      if (
        currentTenant.logo_url &&
        logo_url &&
        currentTenant.logo_url !== logo_url
      ) {
        await deleteFile(currentTenant.logo_url);
      }

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
      return res.status(400).json({ error: "Erro ao atualizar perfil." });
    }
  }
}
