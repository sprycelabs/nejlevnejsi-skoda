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
