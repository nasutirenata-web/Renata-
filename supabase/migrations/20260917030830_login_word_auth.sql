-- Passwordless login via a short-lived marketing-word code stored on auth.users metadata.
-- Runs as security definer so it can be called with the anon/publishable key without
-- exposing the auth schema directly.

create or replace function public.set_login_word(p_email text, p_word text, p_ttl_minutes int default 10)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  update auth.users
  set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
    || jsonb_build_object(
      'login_word', p_word,
      'login_word_expires_at', to_char(now() + (p_ttl_minutes || ' minutes')::interval, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
    )
  where email = p_email;
end;
$$;

revoke all on function public.set_login_word(text, text, int) from public;
grant execute on function public.set_login_word(text, text, int) to anon, authenticated;

create or replace function public.consume_login_word(p_email text, p_word text)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
  v_stored_word text;
  v_expires_at timestamptz;
begin
  select id, raw_user_meta_data->>'login_word', (raw_user_meta_data->>'login_word_expires_at')::timestamptz
  into v_user_id, v_stored_word, v_expires_at
  from auth.users
  where email = p_email;

  if v_user_id is null or v_stored_word is null or v_stored_word <> p_word then
    return null;
  end if;

  if v_expires_at is null or v_expires_at < now() then
    return null;
  end if;

  update auth.users
  set raw_user_meta_data = raw_user_meta_data - 'login_word' - 'login_word_expires_at'
  where id = v_user_id;

  return v_user_id;
end;
$$;

revoke all on function public.consume_login_word(text, text) from public;
grant execute on function public.consume_login_word(text, text) to anon, authenticated;
