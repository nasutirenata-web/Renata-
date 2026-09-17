-- Capsule GTM — esquema base
-- Ejecutar en el SQL editor de Supabase (o vía `supabase db push`).
-- Todas las tablas de negocio están aisladas por organization_id + RLS.

create extension if not exists "pgcrypto";

-- ─── Identidad ────────────────────────────────────────────────────────────

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create type member_role as enum ('owner', 'member', 'viewer');

create table memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role member_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

-- ─── CRM ──────────────────────────────────────────────────────────────────

create type gtm_origin as enum ('outbound', 'inbound');

create table companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  segment text, -- ej: "farmacia", "comercio"
  origin gtm_origin not null default 'outbound',
  website text,
  notes text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  company_id uuid references companies (id) on delete set null,
  full_name text not null,
  role_title text,
  email text,
  phone text,
  preferred_channel text, -- 'email' | 'whatsapp' | 'linkedin'
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create type deal_stage as enum ('contacto', 'interes', 'reunion', 'pedido', 'cliente');

create table deals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  company_id uuid references companies (id) on delete cascade,
  origin gtm_origin not null default 'outbound',
  stage deal_stage not null default 'contacto',
  title text not null,
  value_estimate numeric,
  owner_id uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table activities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  company_id uuid references companies (id) on delete cascade,
  contact_id uuid references contacts (id) on delete set null,
  deal_id uuid references deals (id) on delete set null,
  kind text not null, -- 'nota' | 'email' | 'whatsapp' | 'llamada' | 'cambio_etapa' | 'ia_generacion'
  body text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

-- ─── Studio / contenido ─────────────────────────────────────────────────

create type content_status as enum (
  'idea', 'planificado', 'borrador', 'disenando', 'revision', 'aprobado', 'programado', 'publicado'
);

create table content_drafts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  tool_slug text not null, -- referencia a lib/skills-registry.ts
  title text,
  status content_status not null default 'borrador',
  company_id uuid references companies (id) on delete set null,
  contact_id uuid references contacts (id) on delete set null,
  deal_id uuid references deals (id) on delete set null,
  inputs jsonb not null default '{}',
  output text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table calendar_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  content_draft_id uuid references content_drafts (id) on delete set null,
  platform text not null,
  scheduled_at timestamptz,
  status content_status not null default 'planificado',
  pillar text,
  angle text,
  cta text,
  created_at timestamptz not null default now()
);

-- ─── Integraciones ────────────────────────────────────────────────────────

create table integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  provider text not null, -- 'linkedin' | 'whatsapp' | 'clay' | 'apollo' | mcp propio, etc.
  status text not null default 'not_connected', -- 'not_connected' | 'connected' | 'error'
  -- credenciales cifradas / opacas; nunca se exponen al cliente directamente
  secret_ref text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, provider)
);

create table mcp_servers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  transport text not null, -- 'http' | 'sse' | 'stdio'
  url text,
  status text not null default 'not_connected',
  created_at timestamptz not null default now()
);

-- ─── Chat ───────────────────────────────────────────────────────────────

create table chat_conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references chat_conversations (id) on delete cascade,
  role text not null, -- 'user' | 'assistant'
  content text not null,
  created_at timestamptz not null default now()
);

-- ─── RLS ──────────────────────────────────────────────────────────────────

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table memberships enable row level security;
alter table companies enable row level security;
alter table contacts enable row level security;
alter table deals enable row level security;
alter table activities enable row level security;
alter table content_drafts enable row level security;
alter table calendar_items enable row level security;
alter table integrations enable row level security;
alter table mcp_servers enable row level security;
alter table chat_conversations enable row level security;
alter table chat_messages enable row level security;

create or replace function is_org_member(org_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from memberships
    where organization_id = org_id and user_id = auth.uid()
  );
$$;

create policy "profiles: self" on profiles
  for all using (id = auth.uid());

create policy "organizations: members can read" on organizations
  for select using (is_org_member(id));

create policy "memberships: members can read own org" on memberships
  for select using (is_org_member(organization_id));

-- Política genérica reaplicada por tabla: lectura/escritura solo si sos miembro
-- de la organización dueña del registro.
do $$
declare
  t text;
begin
  foreach t in array array[
    'companies', 'contacts', 'deals', 'activities', 'content_drafts',
    'calendar_items', 'integrations', 'mcp_servers', 'chat_conversations'
  ]
  loop
    execute format(
      'create policy "%1$s: org members" on %1$s for all using (is_org_member(organization_id)) with check (is_org_member(organization_id));',
      t
    );
  end loop;
end $$;

create policy "chat_messages: via conversation org" on chat_messages
  for all using (
    exists (
      select 1 from chat_conversations c
      where c.id = conversation_id and is_org_member(c.organization_id)
    )
  );
