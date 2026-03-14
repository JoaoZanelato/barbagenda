# 💈 BarbAgenda - SaaS para Barbearias

**BarbAgenda** é uma plataforma de Software as a Service (SaaS) dedicada à gestão completa de barbearias. O ecossistema permite que múltiplas barbearias (tenants) giram as suas agendas, profissionais e serviços, enquanto os clientes podem marcar horários através de uma aplicação mobile dedicada.

Criado por: **João Guilherme Butka Zanelato** (SoftwareByZane).

---

## 🚀 Arquitetura e Tecnologias

O projeto é um Monorepo dividido em três frentes principais:

- **Backend (API):** Node.js, TypeScript, Express.js, Prisma ORM, PostgreSQL.
- **Web (Painel Administrativo):** React, Vite.
- **Mobile (App do Cliente):** React Native, Expo.

## ✨ Funcionalidades Atuais

- **Multi-tenancy:** Suporte nativo para múltiplas barbearias na mesma base de dados, isoladas pelo `tenant_id`.
- **Gestão de Agendamentos:** Criação, listagem e cancelamento de horários.
- **Disponibilidade Dinâmica:** Cálculo inteligente de slots livres com base no horário de funcionamento e tempo dos serviços.
- **Notificações Push:** Avisos em tempo real para clientes e barbeiros sobre novos agendamentos ou cancelamentos.
- **Perfis e Favoritos:** Clientes podem favoritar barbearias e ver o histórico de cortes.
- **Autenticação Híbrida:** Login web para administradores/barbeiros e login mobile para clientes.

---

## 🗺️ Roadmap de Produção (Checklist para o Deploy)

Antes de lançar a versão 1.0 para clientes reais, os seguintes passos técnicos devem ser concluídos na infraestrutura do backend:

- [ ] **Segurança da API:** Instalar e configurar `helmet` (proteção de cabeçalhos HTTP) e `express-rate-limit` (prevenção contra ataques de força bruta).
- [ ] **Restrição de CORS:** Atualizar o middleware de CORS no `server.ts` para permitir apenas os domínios oficiais de produção (ex: `https://barbagenda.com`) e requisições nativas do App Mobile.
- [ ] **Storage na Nuvem:** Substituir o armazenamento local do `multer` (`/uploads`) pela integração com um serviço de nuvem (ex: AWS S3 ou Cloudflare R2) para evitar perda de avatares e logótipos ao reiniciar o servidor.
- [ ] **Scripts de Build:** Garantir que o `package.json` possui o comando `tsc` para transpilar o TypeScript para JavaScript (`/dist`) de forma otimizada para produção.
- [ ] **Migrações Seguras:** Configurar a pipeline de deploy para executar exclusivamente `npx prisma migrate deploy` (e nunca `db push`) para preservar a integridade dos dados reais.
- [ ] **Variáveis de Ambiente:** Definir senhas fortes, chaves de API e URLs de produção num ficheiro `.env` seguro no servidor de hospedagem.

---

## 🛠️ Como correr o projeto localmente

1. Clona o repositório.
2. Instala as dependências na raiz, na pasta `web` e na pasta `mobile` executando `npm install`.
3. Configura as variáveis de ambiente baseando-te no ficheiro `.env.example`.
4. Corre o docker-compose para iniciar a base de dados: `docker-compose up -d`.
5. Executa as migrações: `npx prisma migrate dev`.
6. Inicia o servidor: `npm run dev`.

---

## 📄 Licença

Este software é proprietário e de código fechado. É estritamente proibida a cópia, distribuição, modificação ou uso comercial sem a autorização expressa do autor. Consulta o ficheiro `LICENSE` para mais detalhes.
