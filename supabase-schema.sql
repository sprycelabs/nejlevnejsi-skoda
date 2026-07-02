-- ============================================================
-- Klientské centrum — Supabase schema
-- Spusť v: Supabase Dashboard → SQL Editor
-- ============================================================

-- Tabulka objednávek
create table if not exists orders (
  id            uuid    default gen_random_uuid() primary key,
  user_id       uuid    references auth.users(id) on delete cascade,  -- nullable! vyplní se až po vytvoření účtu
  email         text,                                    -- email zákazníka — propojení před vytvořením účtu
  car_name      text    not null,                        -- např. "Škoda Octavia Classic"
  car_slug      text,                                    -- např. "octavia-classic-config-03"
  car_variant   text,                                    -- např. "Classic 1,5 TSI m-HEV 110 kW DSG"
  car_color     text,                                    -- např. "Červená Velvet metalíza"
  price         integer,                                 -- prodejní cena v Kč
  deposit_paid  integer,                                 -- zaplacená záloha v Kč
  order_number  text,                                    -- interní číslo objednávky
  status        text    default 'prijato'
                        check (status in (
                          'prijato',
                          'zpracovava_se',
                          'potvrzeno_dealerem',
                          'na_ceste',
                          'prihlasovani',
                          'dorucovani',
                          'doruceno'
                        )),
  notes         text,                                    -- poznámka zákazníka
  admin_note    text,                                    -- komentář správce viditelný klientem
  internal_id   text,                                    -- interní ID vozu z cars.js (např. TMBxxxxxxV/0052)
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Row Level Security
alter table orders enable row level security;

-- Klient vidí objednávky kde sedí jeho user_id NEBO jeho email (pro případ bez účtu)
create policy "Klient vidí své objednávky"
  on orders for select
  using (
    auth.uid() = user_id
    OR auth.email() = email
  );

-- Service role (API) může vkládat objednávky bez přihlášení
-- (service role bypasses RLS automaticky)

-- ============================================================
-- MIGRACE existující tabulky (spusť pokud tabulka už existuje):
-- ============================================================
-- ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS email text;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS internal_id text;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_note text;
-- ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
-- ALTER TABLE orders ADD CONSTRAINT orders_status_check
--   CHECK (status IN ('prijato','zpracovava_se','potvrzeno_dealerem','na_ceste','prihlasovani','dorucovani','doruceno'));
-- DROP POLICY IF EXISTS "Klient vidí jen své objednávky" ON orders;
-- DROP POLICY IF EXISTS "Klient vidí své objednávky" ON orders;
-- CREATE POLICY "Klient vidí své objednávky" ON orders FOR SELECT
--   USING (auth.uid() = user_id OR auth.email() = email);

-- ============================================================
-- Jak přidat klienta:
-- 1. Supabase Dashboard → Authentication → Users → "Add user"
--    Zadej email + heslo, zaškrtni "Auto Confirm User"
--    Objednávky se propojí automaticky přes shodný email.
--
-- Jak ručně přidat / aktualizovat objednávku:
-- INSERT INTO orders (email, car_name, car_variant, car_color, price, status, internal_id, order_number, admin_note)
-- VALUES ('zakaznik@email.cz', 'Škoda Octavia Classic', 'Classic 1,5 TSI 85 kW', 'Modrá Energy', 534900, 'prijato', 'TMBxxxxxxV/0052', 'OBJ-2026-001', 'Váš vůz byl potvrzen dealerem.');
-- ============================================================


-- ============================================================
-- Rozšíření orders tabulky — kompletní data z pokladny
-- Spusť jako migraci pokud tabulka již existuje
-- ============================================================

alter table orders add column if not exists first_name        text;
alter table orders add column if not exists last_name         text;
alter table orders add column if not exists company_name      text;
alter table orders add column if not exists ico               text;
alter table orders add column if not exists dic               text;
alter table orders add column if not exists contact_person    text;
alter table orders add column if not exists phone             text;
alter table orders add column if not exists street            text;
alter table orders add column if not exists city              text;
alter table orders add column if not exists zip               text;
alter table orders add column if not exists customer_type     text;   -- 'fyzicka' | 'firma'
alter table orders add column if not exists payment_method    text;   -- 'prevod' | 'osobne'
alter table orders add column if not exists delivery          boolean default false;
alter table orders add column if not exists discount_code     text;
alter table orders add column if not exists discount_amount   integer default 0;
alter table orders add column if not exists price_original    integer;  -- cena vozu bez slevy
alter table orders add column if not exists price_final       integer;  -- cena vozu po slevě (podíl z celku)
alter table orders add column if not exists qty               integer default 1;
alter table orders add column if not exists is_used           boolean default false;
alter table orders add column if not exists charity           text;

-- ============================================================
-- is_new příznak na objednávkách
-- ============================================================

alter table orders add column if not exists is_new boolean not null default true;

-- Existující záznamy označit jako viděné
update orders set is_new = false;

-- ============================================================
-- Tabulka zákazníků
-- ============================================================

create table if not exists customers (
  id         uuid        default gen_random_uuid() primary key,
  email      text        not null unique,
  is_new     boolean     not null default true,
  created_at timestamptz default now()
);

alter table customers enable row level security;

-- Admin vidí všechny zákazníky
create policy "Admin vidí zákazníky"
  on customers for select
  using (is_admin());

-- Admin může upravovat (is_new = false)
create policy "Admin může upravovat zákazníky"
  on customers for update
  using (is_admin())
  with check (is_admin());

-- Service role může vkládat (bypass RLS automaticky)

-- Naplň existující zákazníky z orders jako is_new = false
insert into customers (email, is_new)
select distinct email, false
from orders
where email is not null
on conflict (email) do nothing;

-- Trigger: při každém novém orderu upsertni zákazníka
-- Pokud email ještě neexistuje → is_new = true (nový zákazník)
-- Pokud existuje → nic se nemění (on conflict do nothing)
create or replace function sync_customer_on_order()
returns trigger
language plpgsql
as $$
begin
  if NEW.email is not null then
    insert into customers (email, is_new)
    values (NEW.email, true)
    on conflict (email) do nothing;
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_sync_customer on orders;
create trigger trg_sync_customer
  after insert on orders
  for each row
  execute function sync_customer_on_order();

-- ============================================================
-- Faktura — cesta do Supabase Storage
-- ============================================================

alter table orders add column if not exists invoice_path text;

-- ============================================================
-- acknowledged příznak — admin potvrzení přijetí
-- ============================================================

alter table orders add column if not exists acknowledged boolean not null default false;

-- ============================================================
-- auth_user_id na zákaznících
-- ============================================================

alter table customers add column if not exists auth_user_id uuid references auth.users(id) on delete set null;

-- ============================================================
-- ADMIN — role a RLS politiky
-- ============================================================

-- Helper funkce: vrátí true pokud má přihlášený uživatel role = admin v app_metadata (JWT)
create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- Admin vidí všechny objednávky
drop policy if exists "Admin vidí všechny objednávky" on orders;
create policy "Admin vidí všechny objednávky"
  on orders for select
  using (is_admin());

-- Admin může upravovat libovolnou objednávku (status, admin_note atd.)
drop policy if exists "Admin může upravovat objednávky" on orders;
create policy "Admin může upravovat objednávky"
  on orders for update
  using (is_admin())
  with check (is_admin());

-- Admin může mazat objednávky
drop policy if exists "Admin může mazat objednávky" on orders;
create policy "Admin může mazat objednávky"
  on orders for delete
  using (is_admin());

-- Admin může ručně vkládat objednávky
drop policy if exists "Admin může vkládat objednávky" on orders;
create policy "Admin může vkládat objednávky"
  on orders for insert
  with check (is_admin());


-- ============================================================
-- Jak nastavit admin roli uživateli:
-- Spusť v SQL Editoru (vyžaduje service role / přístup k auth.users)
-- ============================================================

-- PŘIDAT admin roli:
-- UPDATE auth.users
-- SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'schonfeldmatej33@gmail.com';

-- ODEBRAT admin roli:
-- UPDATE auth.users
-- SET raw_app_meta_data = raw_app_meta_data - 'role'
-- WHERE email = 'schonfeldmatej33@gmail.com';

-- OVĚŘIT aktuální metadata uživatele:
-- SELECT email, raw_app_meta_data FROM auth.users WHERE email = 'schonfeldmatej33@gmail.com';
-- ============================================================
