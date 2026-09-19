-- Ampliación compatible: conserva datos y políticas existentes.
begin;
alter table public.deals add column if not exists primary_contact_id uuid;
alter table public.contacts add column if not exists qualification_reason text;
alter table public.contacts add column if not exists qualified_at timestamptz;
alter table public.contacts add column if not exists qualification_source text;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'deals_primary_contact_same_org') then
    alter table public.deals add constraint deals_primary_contact_same_org
      foreign key (organization_id, primary_contact_id) references public.contacts(organization_id,id);
  end if;
end $$;

-- Un evento comprobado modifica solo su persona. Nunca mueve oportunidades.
-- Se ordena por fecha del evento, no de recepción: un evento viejo no pisa uno nuevo.
create or replace function public.qualify_contact_from_activity() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare event record; selected_temp public.lead_temperature; reason text;
begin
  if new.contact_id is null or new.kind not in
    ('respuesta_interes','reunion_confirmada','propuesta_solicitada','sin_interes','fuera_icp','baja_solicitada') then return new; end if;
  -- Serializa señales concurrentes para una misma persona.
  perform id from public.contacts where id=new.contact_id and organization_id=new.organization_id for update;
  select kind,created_at into event from public.activities
    where contact_id=new.contact_id and organization_id=new.organization_id
      and kind in ('respuesta_interes','reunion_confirmada','propuesta_solicitada','sin_interes','fuera_icp','baja_solicitada')
    order by created_at desc,id desc limit 1;
  selected_temp := case event.kind when 'respuesta_interes' then 'warm'::public.lead_temperature
    when 'reunion_confirmada' then 'hot'::public.lead_temperature when 'propuesta_solicitada' then 'hot'::public.lead_temperature
    else 'cold'::public.lead_temperature end;
  reason := case event.kind
    when 'respuesta_interes' then 'El contacto respondió con interés.'
    when 'reunion_confirmada' then 'El contacto confirmó una reunión.'
    when 'propuesta_solicitada' then 'El contacto pidió una propuesta comercial.'
    when 'sin_interes' then 'El contacto indicó que no tiene interés.'
    when 'fuera_icp' then 'Se confirmó que el contacto no encaja con el cliente ideal.'
    else 'Pidió no recibir más mensajes. No continuar el contacto.' end;
  update public.contacts set temperature=selected_temp,qualification_reason=reason,
    qualified_at=event.created_at,qualification_source='activity'
    where id=new.contact_id and organization_id=new.organization_id;
  return new;
end $$;
revoke execute on function public.qualify_contact_from_activity() from public, anon, authenticated;
drop trigger if exists qualify_contact_activity on public.activities;
create trigger qualify_contact_activity after insert on public.activities
  for each row execute function public.qualify_contact_from_activity();
create index if not exists activities_contact_signals_idx on public.activities(organization_id,contact_id,created_at desc);
commit;
