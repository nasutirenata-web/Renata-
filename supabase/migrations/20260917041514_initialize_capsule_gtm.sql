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

create type lead_temperature as enum ('cold', 'warm', 'hot');

create table contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  company_id uuid references companies (id) on delete set null,
  full_name text not null,
  role_title text,
  email text,
  phone text,
  preferred_channel text, -- 'email' | 'whatsapp' | 'linkedin'
  origin gtm_origin not null default 'outbound',
  temperature lead_temperature not null default 'cold',
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


-- Seguridad: los permisos de plataforma nunca otorgan acceso a datos comerciales.
create table platform_admins (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
create table strategy_drafts (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references organizations(id) on delete cascade,
 section_key text not null,
 values jsonb not null default '{}',
 updated_by uuid references auth.users(id),
 updated_at timestamptz not null default now(),
 unique(organization_id, section_key)
);
alter table deals add column next_action text;
alter table deals add column next_action_at date;
alter table deals add column currency text not null default 'USD';
alter table deals add constraint value_nonnegative check(value_estimate is null or value_estimate >= 0);

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create function private.is_org_member(org_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists (
 select 1 from public.memberships where organization_id=org_id and user_id=(select auth.uid()));
$$;
create function private.can_write_org(org_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists (
 select 1 from public.memberships where organization_id=org_id and user_id=(select auth.uid()) and role in ('owner','member'));
$$;
create function private.is_platform_admin() returns boolean
language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists(select 1 from public.platform_admins where user_id=(select auth.uid()));
$$;
create function public.is_platform_admin() returns boolean
language sql stable security invoker set search_path = '' as $$
 select private.is_platform_admin();
$$;
-- Authenticated, idempotent onboarding. Caller may only create their own first workspace.
create function private.create_organization_with_owner(org_name text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare new_org_id uuid;
begin
 if auth.uid() is null then raise exception 'not authenticated'; end if;
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,0));
 select organization_id into new_org_id from public.memberships where user_id=auth.uid() order by created_at limit 1;
 if new_org_id is not null then return new_org_id; end if;
 if length(trim(org_name)) < 1 or length(trim(org_name)) > 120 then raise exception 'Nombre de organización inválido'; end if;
 insert into public.organizations(name) values(trim(org_name)) returning id into new_org_id;
 insert into public.profiles(id) values(auth.uid()) on conflict(id) do nothing;
 insert into public.memberships(organization_id,user_id,role) values(new_org_id,auth.uid(),'owner');
 return new_org_id;
end;
$$;
create function public.create_organization_with_owner(org_name text) returns uuid
language sql security invoker set search_path = '' as $$
 select private.create_organization_with_owner(org_name);
$$;

revoke all on all functions in schema private from public, anon;
grant execute on function private.is_org_member(uuid), private.can_write_org(uuid), private.is_platform_admin(), private.create_organization_with_owner(text) to authenticated;
revoke all on function public.is_platform_admin(), public.create_organization_with_owner(text) from public, anon;
grant execute on function public.is_platform_admin(), public.create_organization_with_owner(text) to authenticated;

do $$
declare t text;
begin
 foreach t in array array['organizations','profiles','memberships','companies','contacts','deals','activities','content_drafts','calendar_items','integrations','mcp_servers','chat_conversations','chat_messages','platform_admins','strategy_drafts']
 loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from anon',t);
 end loop;
 foreach t in array array['companies','contacts','deals','activities','content_drafts','calendar_items','mcp_servers','chat_conversations','strategy_drafts']
 loop
 execute format('grant select,insert,update,delete on public.%I to authenticated',t);
 execute format('create policy org_read on public.%I for select to authenticated using(private.is_org_member(organization_id))',t);
 execute format('create policy org_insert on public.%I for insert to authenticated with check(private.can_write_org(organization_id))',t);
 execute format('create policy org_update on public.%I for update to authenticated using(private.can_write_org(organization_id)) with check(private.can_write_org(organization_id))',t);
 execute format('create policy org_delete on public.%I for delete to authenticated using(private.can_write_org(organization_id))',t);
 execute format('create index on public.%I(organization_id)',t);
 end loop;
end $$;
grant select on organizations,memberships,platform_admins,integrations to authenticated;
grant select,update on profiles to authenticated;
grant select,insert,update,delete on chat_messages to authenticated;
create policy organization_read on organizations for select to authenticated using(private.is_org_member(id) or private.is_platform_admin());
create policy membership_read on memberships for select to authenticated using(private.is_org_member(organization_id));
create policy profile_read on profiles for select to authenticated using(id=(select auth.uid()));
create policy profile_update on profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
create policy admin_read_self on platform_admins for select to authenticated using(user_id=(select auth.uid()));
-- Integration status/metadata only, no client-writable credential or connection claims.
revoke insert,update,delete on integrations from authenticated;
create policy integration_read on integrations for select to authenticated using(private.is_org_member(organization_id));
create policy chat_read on chat_messages for select to authenticated using(exists(select 1 from chat_conversations c where c.id=conversation_id and private.is_org_member(c.organization_id)));
create policy chat_insert on chat_messages for insert to authenticated with check(exists(select 1 from chat_conversations c where c.id=conversation_id and private.can_write_org(c.organization_id)));
create policy chat_update on chat_messages for update to authenticated using(exists(select 1 from chat_conversations c where c.id=conversation_id and private.can_write_org(c.organization_id))) with check(exists(select 1 from chat_conversations c where c.id=conversation_id and private.can_write_org(c.organization_id)));
create policy chat_delete on chat_messages for delete to authenticated using(exists(select 1 from chat_conversations c where c.id=conversation_id and private.can_write_org(c.organization_id)));
create index on memberships(user_id,organization_id);
create index on chat_messages(conversation_id);
create index on integrations(organization_id);

-- Composite keys prevent cross-organization entity references, including direct API writes.
alter table companies add constraint companies_org_id_unique unique(organization_id,id);
alter table contacts add constraint contacts_org_id_unique unique(organization_id,id);
alter table deals add constraint deals_org_id_unique unique(organization_id,id);
alter table content_drafts add constraint drafts_org_id_unique unique(organization_id,id);
alter table contacts add constraint contacts_company_same_org foreign key(organization_id,company_id) references companies(organization_id,id);
alter table deals add constraint deals_company_same_org foreign key(organization_id,company_id) references companies(organization_id,id);
alter table activities add constraint activities_company_same_org foreign key(organization_id,company_id) references companies(organization_id,id);
alter table activities add constraint activities_contact_same_org foreign key(organization_id,contact_id) references contacts(organization_id,id);
alter table activities add constraint activities_deal_same_org foreign key(organization_id,deal_id) references deals(organization_id,id);
alter table content_drafts add constraint drafts_company_same_org foreign key(organization_id,company_id) references companies(organization_id,id);
alter table content_drafts add constraint drafts_contact_same_org foreign key(organization_id,contact_id) references contacts(organization_id,id);
alter table content_drafts add constraint drafts_deal_same_org foreign key(organization_id,deal_id) references deals(organization_id,id);
alter table calendar_items add constraint calendar_draft_same_org foreign key(organization_id,content_draft_id) references content_drafts(organization_id,id);
