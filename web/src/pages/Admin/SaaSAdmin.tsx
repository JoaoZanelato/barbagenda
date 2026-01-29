import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Header } from "../../components/layout/Header";
import { Card, CardContent } from "../../components/ui/Card/Card";
import { Button } from "../../components/ui/Button/Button";
import { Modal } from "../../components/ui/Modal/Modal";
import { Input } from "../../components/ui/Input/Input";
import { Plus, Building2, ExternalLink, Trash2 } from "lucide-react";
import { format } from "date-fns";

// Interface do Tenant vindo da API
interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan_status: string;
  created_at: string;
  _count?: {
    users: number;
    customers: number;
    appointments: number;
  };
}

export function SaaSAdmin() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form para nova barbearia
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    userName: "",
    email: "",
    password: "",
    phone: "",
  });

  async function loadTenants() {
    try {
      const response = await api.get("/tenants");
      setTenants(response.data);
    } catch (error) {
      console.error("Erro ao carregar barbearias", error);
    }
  }

  useEffect(() => {
    loadTenants();
  }, []);

  async function handleCreateTenant(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/tenants", formData);
      alert("Barbearia criada com sucesso! 🚀");
      setIsModalOpen(false);
      setFormData({
        name: "",
        slug: "",
        userName: "",
        email: "",
        password: "",
        phone: "",
      });
      loadTenants(); // Recarrega a lista
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao criar barbearia");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <Header />

      <main className="max-w-6xl mx-auto p-6 mt-8 space-y-8">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              SaaS Admin
            </h1>
            <p className="text-zinc-400 mt-1">
              Gerencie todas as barbearias da plataforma.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Barbearia
          </Button>
        </div>

        {/* Lista de Barbearias */}
        <Card className="border-zinc-800 bg-zinc-900 overflow-hidden">
          <CardContent className="p-0">
            {tenants.length === 0 ? (
              <div className="p-12 text-center">
                <Building2 className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-zinc-300">
                  Nenhuma barbearia
                </h3>
                <p className="text-zinc-500">
                  Cadastre a primeira para começar.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 text-zinc-400 font-medium border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3">Nome / Slug</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Métricas (Usu/Cli/Age)</th>
                    <th className="px-4 py-3">Criado em</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {tenants.map((tenant) => (
                    <tr
                      key={tenant.id}
                      className="hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">
                          {tenant.name}
                        </div>
                        <div className="text-xs text-zinc-500">
                          /{tenant.slug}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                          {tenant.plan_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">
                        {tenant._count?.users || 0} /{" "}
                        {tenant._count?.customers || 0} /{" "}
                        {tenant._count?.appointments || 0}
                      </td>
                      <td className="px-4 py-3 text-zinc-500">
                        {format(new Date(tenant.created_at), "dd/MM/yyyy")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a
                          href={`/barbearia/${tenant.slug}/servicos`} // Link para página pública (futura)
                          target="_blank"
                          rel="noreferrer"
                          className="text-gold-500 hover:underline text-xs inline-flex items-center"
                        >
                          Ver Loja <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* MODAL DE CRIAÇÃO */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Nova Barbearia"
      >
        <form onSubmit={handleCreateTenant} className="space-y-4">
          <div className="space-y-4 border-b border-zinc-800 pb-4">
            <h3 className="text-sm font-medium text-gold-500 uppercase tracking-wider">
              Dados da Loja
            </h3>
            <Input
              label="Nome da Barbearia"
              placeholder="Ex: Barbearia do Zé"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="Slug (Link)"
              placeholder="ex: barbearia-do-ze"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gold-500 uppercase tracking-wider">
              Dados do Dono (Admin)
            </h3>
            <Input
              label="Nome do Dono"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <Input
                label="Telefone (WhatsApp)"
                placeholder="5511999999999"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
            <Input
              label="Senha de Acesso"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Criar Sistema
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
