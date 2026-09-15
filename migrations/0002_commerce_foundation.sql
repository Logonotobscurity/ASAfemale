-- Commerce foundation for tenant-safe WhatsApp handoff, consent, analytics,
-- shopper routing, and resumable co-browse sessions.

create table if not exists tenants (
  id text primary key,
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default current_timestamp
);

create table if not exists products (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  sku text not null,
  name text not null,
  category text not null,
  price_cents integer not null check (price_cents >= 0),
  compare_at_cents integer check (compare_at_cents is null or compare_at_cents >= price_cents),
  attributes jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default current_timestamp,
  unique (tenant_id, sku)
);

create table if not exists product_variants (
  id text primary key,
  product_id text not null references products(id) on delete cascade,
  size_label text not null,
  stock integer not null default 0 check (stock >= 0),
  reserved integer not null default 0 check (reserved >= 0 and reserved <= stock)
);

create table if not exists consent_records (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  user_id text references "user"("id") on delete set null,
  channel text not null check (channel in ('analytics', 'location', 'whatsapp', 'sms', 'cobrowse')),
  granted boolean not null,
  scope text not null,
  source text not null,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default current_timestamp
);

create table if not exists analytics_events (
  id bigint generated always as identity primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  anonymous_id text not null,
  user_id text references "user"("id") on delete set null,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default current_timestamp,
  idempotency_key text not null unique
);

create table if not exists orders (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  user_id text references "user"("id") on delete set null,
  reference text not null unique,
  status text not null default 'initiated' check (status in ('initiated', 'handed_off', 'confirmed', 'paid', 'fulfilled', 'cancelled', 'expired')),
  total_cents integer not null check (total_cents >= 0),
  pricing_snapshot jsonb not null,
  whatsapp_status text not null default 'not_sent',
  created_at timestamptz not null default current_timestamp
);

create table if not exists order_events (
  id bigint generated always as identity primary key,
  order_id text not null references orders(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  actor text not null,
  created_at timestamptz not null default current_timestamp,
  unique (order_id, event_type)
);

create table if not exists location_grants (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  user_id text references "user"("id") on delete set null,
  approximate_area text not null,
  accuracy_m integer not null check (accuracy_m > 0),
  purpose text not null default 'nearest_shopper',
  expires_at timestamptz not null,
  created_at timestamptz not null default current_timestamp
);

create table if not exists support_sessions (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  user_id text references "user"("id") on delete set null,
  scope text not null check (scope in ('view', 'control')),
  status text not null default 'requested' check (status in ('requested', 'active', 'ended', 'expired', 'revoked')),
  consent_id text references consent_records(id) on delete set null,
  nearest_area text,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default current_timestamp
);

create index if not exists products_tenant_category_idx on products (tenant_id, category);
create index if not exists variants_product_idx on product_variants (product_id);
create index if not exists consent_lookup_idx on consent_records (tenant_id, user_id, channel, created_at desc);
create index if not exists analytics_lookup_idx on analytics_events (tenant_id, event_name, occurred_at desc);
create index if not exists orders_tenant_status_idx on orders (tenant_id, status, created_at desc);
create index if not exists support_sessions_tenant_status_idx on support_sessions (tenant_id, status, created_at desc);

insert into tenants (id, slug, name)
values ('asa-default', 'asa', 'ÀṢÀ')
on conflict (id) do nothing;

insert into products (id, tenant_id, sku, name, category, price_cents, compare_at_cents, attributes)
values
  ('prod-sk-01', 'asa-default', 'SK-01', 'A-Line Midi Skirt', 'skirts', 1200000, 1500000, '{"fabric":"cotton twill","silhouette":"a-line","color":"bone"}'),
  ('prod-tr-02', 'asa-default', 'TR-02', 'Cargo Wide-Leg Trouser', 'trousers', 1800000, 2100000, '{"fabric":"corduroy","silhouette":"wide-leg","color":"ink"}'),
  ('prod-mw-01', 'asa-default', 'MW-01', 'Mamiwata Mermaid Gown', 'gown', 4800000, 5500000, '{"fabric":"stretch scuba","silhouette":"mermaid","occasion":"owambe"}'),
  ('prod-tn-01', 'asa-default', 'TN-01', 'Press-Pleat Tennis Skirt', 'tennis', 1000000, 1400000, '{"fabric":"press-pleat","silhouette":"pleated","color":"bone"}')
on conflict (tenant_id, sku) do nothing;

insert into product_variants (id, product_id, size_label, stock)
select 'variant-' || p.sku || '-' || s.size_label, p.id, s.size_label, 12
from products p
cross join (values ('6'), ('8'), ('10'), ('12'), ('26'), ('28'), ('30'), ('32')) as s(size_label)
where p.tenant_id = 'asa-default'
on conflict (id) do nothing;

-- The canonical catalog is seeded above; later admin tooling can replace it.
-- No client-supplied price is trusted by order handlers.

-- Downstream event consumers can safely process this index in occurred_at order.
create index if not exists analytics_tenant_time_idx on analytics_events (tenant_id, occurred_at desc);
create index if not exists order_events_order_time_idx on order_events (order_id, created_at desc);
create index if not exists location_grants_expiry_idx on location_grants (tenant_id, expires_at);
create index if not exists support_sessions_user_idx on support_sessions (tenant_id, user_id, created_at desc);

-- Runtime handlers only read location grants created with explicit user consent.

-- Explicitly record the schema version for operational inspection.
create table if not exists app_schema_versions (
  version text primary key,
  applied_at timestamptz not null default current_timestamp
);

insert into app_schema_versions (version) values ('commerce-foundation-v1') on conflict (version) do nothing;
