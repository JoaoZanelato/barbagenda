-- =================================================================
-- SCRIPT DE INICIALIZAÇÃO - BARBER SAAS MVP (PostgreSQL)
-- =================================================================

-- 1. HABILITAR EXTENSÕES
-- Necessário para gerar IDs únicos e aleatórios (UUID)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- ESTRUTURA BASE (TENANCY & ACESSOS)
-- =================================================================

-- Tabela de Barbearias (Tenants)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL, -- URL amigável (ex: app.com/barbearia-do-ze)
    
    -- Configurações da Meta API (Centralizado ou por Cliente)
    whatsapp_phone_id VARCHAR(100), 
    business_account_id VARCHAR(100),
    
    plan_status VARCHAR(20) DEFAULT 'trial', -- 'free', 'trial', 'pro', 'blocked'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Usuários do Sistema (Barbeiros/Recepcionistas/Donos)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Lembre de salvar com Bcrypt/Argon2
    phone VARCHAR(20), -- Telefone pessoal para contato interno
    
    role VARCHAR(20) DEFAULT 'admin', -- 'owner', 'barber', 'receptionist'
    
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- CORE DO NEGÓCIO (SERVIÇOS & CLIENTES)
-- =================================================================

-- Tabela de Serviços (O que a barbearia vende)
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL, -- Ex: "Corte Navalhado"
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER NOT NULL, -- Crítico para o algoritmo de agenda
    
    active BOOLEAN DEFAULT TRUE, -- Soft delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Clientes Finais
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL, -- Formato E.164 (5541999999999)
    
    notes TEXT, -- "Cliente gosta de café sem açúcar", "Alergia a talco"
    last_visit_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para garantir que buscamos o cliente pelo telefone instantaneamente
CREATE INDEX idx_customers_phone_tenant ON customers(phone, tenant_id);

-- =================================================================
-- REGRAS DE TEMPO & DISPONIBILIDADE
-- =================================================================

-- Horário de Funcionamento (Regra Geral)
CREATE TABLE operating_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Dom, 1=Seg...
    open_time TIME NOT NULL,  -- Ex: 09:00
    close_time TIME NOT NULL, -- Ex: 19:00
    is_closed BOOLEAN DEFAULT FALSE, -- Se TRUE, a barbearia não abre nesse dia da semana
    
    UNIQUE(tenant_id, day_of_week) -- Evita duplicidade de regra para o mesmo dia
);

-- Bloqueios Manuais (Exceções: Almoço, Médico, Feriado)
CREATE TABLE blocked_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Se NULL, bloqueia a loja toda
    
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    reason VARCHAR(100), -- Ex: "Almoço", "Manutenção"
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- AGENDAMENTOS & MENSAGERIA
-- =================================================================

-- Tabela de Agendamentos (Tabela Fato)
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    
    customer_id UUID REFERENCES customers(id),
    professional_id UUID REFERENCES users(id), -- Quem vai cortar
    service_id UUID REFERENCES services(id),
    
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Status do fluxo
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show')),
    
    -- Controle de Reagendamento (Lógica discutida)
    original_appointment_id UUID REFERENCES appointments(id), -- Aponta para o agendamento anterior se for remarcação
    reschedule_count INTEGER DEFAULT 0, 
    
    -- Controle de Notificações
    whatsapp_reminder_sent BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para o algoritmo de busca de horários (CRÍTICO PARA PERFORMANCE)
CREATE INDEX idx_appointments_range ON appointments(professional_id, start_time, end_time);
CREATE INDEX idx_appointments_date ON appointments(tenant_id, start_time);

-- Logs de Mensagens do WhatsApp (Auditoria e Debug da API Meta)
CREATE TABLE message_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    
    direction VARCHAR(10) CHECK (direction IN ('INBOUND', 'OUTBOUND')),
    message_type VARCHAR(20), -- 'TEMPLATE', 'TEXT', 'INTERACTIVE'
    content TEXT, -- JSON payload ou texto
    
    meta_message_id VARCHAR(100), -- ID oficial do WhatsApp para tracking de entrega
    status VARCHAR(20), -- 'sent', 'delivered', 'read', 'failed'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- DADOS DE EXEMPLO (SEED) - PARA TESTAR AGORA
-- =================================================================

-- 1. Criar uma Barbearia
INSERT INTO tenants (id, name, slug) 
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Barbearia do Mestre', 'barbearia-mestre');

-- 2. Criar um Barbeiro (Dono)
INSERT INTO users (tenant_id, name, email, password_hash, role)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'João Zanelato', 'joao@barber.com', 'hash_senha_segura', 'owner');

-- 3. Criar Serviços
INSERT INTO services (tenant_id, name, price, duration_minutes)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Corte Degradê', 45.00, 45),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Barba Terapia', 35.00, 30);

-- 4. Definir Horário (Segunda a Sexta, 09h as 18h)
INSERT INTO operating_hours (tenant_id, day_of_week, open_time, close_time)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, '09:00', '18:00'), -- Seg
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, '09:00', '18:00'), -- Ter
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 3, '09:00', '18:00'), -- Qua
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 4, '09:00', '18:00'), -- Qui
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 5, '09:00', '18:00'); -- Sex

-- 5. Adicionar um Bloqueio de Almoço para Hoje (Exemplo)
INSERT INTO blocked_slots (tenant_id, start_time, end_time, reason)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() + interval '1 hour', NOW() + interval '2 hours', 'Almoço');