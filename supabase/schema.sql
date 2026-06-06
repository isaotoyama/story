create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text,
  name text,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 120),
  description text check (char_length(description) <= 1000),
  created_by uuid not null references users(id) on delete cascade,
  status text not null default 'open' check (status in ('open', 'closed', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists story_contributions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  content text not null check (char_length(content) between 20 and 2000),
  order_index integer not null,
  approved boolean default true,
  created_at timestamptz default now(),
  unique(topic_id, order_index)
);

create index if not exists idx_topics_created_by on topics(created_by);
create index if not exists idx_topics_status_created_at on topics(status, created_at desc);
create index if not exists idx_contributions_topic_order on story_contributions(topic_id, order_index);
create index if not exists idx_contributions_user on story_contributions(user_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists topics_set_updated_at on topics;
create trigger topics_set_updated_at
before update on topics
for each row execute function set_updated_at();

alter table users enable row level security;
alter table topics enable row level security;
alter table story_contributions enable row level security;

-- This MVP uses the Supabase service role key from Next.js route handlers.
-- Do not expose SUPABASE_SERVICE_ROLE_KEY in the browser.
