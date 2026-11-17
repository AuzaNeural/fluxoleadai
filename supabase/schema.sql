-- ==============================================================================
-- FLUXO LEAD AI - ESQUEMA DE BANCO DE DADOS SUPABASE (POSTGRESQL IDEMPOTENTE)
-- ==============================================================================

-- 1. Tabela de Leads
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company_name TEXT NOT NULL,
    niche TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    phone TEXT,
    whatsapp TEXT,
    whatsapp_confirmed BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'Novo lead',
    has_website BOOLEAN DEFAULT false,
    website TEXT,
    website_status TEXT DEFAULT 'Site não informado',
    next_contact TEXT DEFAULT '—',
    contacted BOOLEAN DEFAULT false,
    source TEXT DEFAULT 'Google Maps',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Lembretes (CRM)
CREATE TABLE IF NOT EXISTS public.reminders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    due_at TIMESTAMP WITH TIME ZONE NOT NULL,
    done BOOLEAN DEFAULT false,
    lead_id TEXT REFERENCES public.leads(id) ON DELETE SET NULL,
    lead_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Modelos de Mensagens (CRM)
CREATE TABLE IF NOT EXISTS public.message_templates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    body TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Inserir os modelos de mensagens padrão (sem conflitos)
INSERT INTO public.message_templates (id, name, body, is_default)
VALUES 
(
    'tpl_1',
    'Primeiro contato — sem site',
    'Olá, tudo bem? Vi a {empresa} aqui em {cidade} e não encontrei um site de vocês. Eu crio sites profissionais prontos em poucos dias, com WhatsApp e localização. Posso te mostrar um modelo do seu segmento? — {meu_nome}',
    true
),
(
    'tpl_2',
    'Primeiro contato — site com problema',
    'Olá! Passei pelo site da {empresa} e notei que ele está com problema para abrir. Trabalho com sites rápidos e que funcionam bem no celular. Quer que eu te mande uma proposta sem compromisso? — {meu_nome}',
    false
),
(
    'tpl_3',
    'Retorno',
    'Oi! Voltando ao nosso papo sobre o site da {empresa}. Conseguiu ver o modelo que te mandei? Fico à disposição. — {meu_nome}',
    false
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    body = EXCLUDED.body;

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de acesso 100% seguras (DROP IF EXISTS garante que nunca dará erro 42710)
DROP POLICY IF EXISTS "Acesso público aos leads" ON public.leads;
CREATE POLICY "Acesso público aos leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso público aos lembretes" ON public.reminders;
CREATE POLICY "Acesso público aos lembretes" ON public.reminders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso público aos modelos" ON public.message_templates;
CREATE POLICY "Acesso público aos modelos" ON public.message_templates FOR ALL USING (true) WITH CHECK (true);
