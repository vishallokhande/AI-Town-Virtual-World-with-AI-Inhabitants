-- ─── AI Town schema ──────────────────────────────────────────────────────────
-- Characters table
create table if not exists public.characters (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  name        text not null,
  emoji       text not null default '🧑',
  age         int not null default 25,
  occupation  text not null default 'Resident',
  personality text,
  traits      text[] default '{}',
  mood        text not null default 'happy',
  mood_emoji  text default '😊',
  energy      int not null default 80 check (energy between 0 and 100),
  happiness   int not null default 80 check (happiness between 0 and 100),
  sociability int not null default 60 check (sociability between 0 and 100),
  backstory   text,
  current_activity text,
  location_id text,
  accent_color text default '#F59E0B',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.characters enable row level security;
create policy "Users can manage their own characters"
  on public.characters for all using (auth.uid() = user_id);

-- ─── Buildings table ──────────────────────────────────────────────────────────
create table if not exists public.buildings (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  type        text not null,
  name        text not null,
  emoji       text not null default '🏠',
  grid_x      int not null default 0,
  grid_y      int not null default 0,
  visitors    int not null default 0,
  description text,
  is_owned    boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.buildings enable row level security;
create policy "Users can manage their own buildings"
  on public.buildings for all using (auth.uid() = user_id);

-- ─── Character memories table ─────────────────────────────────────────────────
create table if not exists public.character_memories (
  id                   uuid primary key default gen_random_uuid(),
  character_id         uuid references public.characters(id) on delete cascade not null,
  text                 text not null,
  emotional_weight     float not null default 0.5 check (emotional_weight between 0 and 1),
  related_character_id uuid references public.characters(id) on delete set null,
  created_at           timestamptz not null default now()
);

alter table public.character_memories enable row level security;
create policy "Users can manage memories of their characters"
  on public.character_memories for all
  using (
    exists (
      select 1 from public.characters c
      where c.id = character_memories.character_id and c.user_id = auth.uid()
    )
  );

-- ─── Relationships table ──────────────────────────────────────────────────────
create table if not exists public.character_relationships (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references public.profiles(id) on delete cascade not null,
  character_a_id   uuid references public.characters(id) on delete cascade not null,
  character_b_id   uuid references public.characters(id) on delete cascade not null,
  type             text not null default 'friend',
  strength         int not null default 50 check (strength between 0 and 100),
  description      text,
  last_interaction timestamptz not null default now(),
  created_at       timestamptz not null default now(),
  unique(character_a_id, character_b_id)
);

alter table public.character_relationships enable row level security;
create policy "Users can manage their relationships"
  on public.character_relationships for all using (auth.uid() = user_id);

-- ─── Town events table ────────────────────────────────────────────────────────
create table if not exists public.town_events (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete cascade not null,
  kind          text not null default 'interaction',
  title         text not null,
  detail        text,
  character_ids text[] default '{}',
  location_id   text,
  emoji         text default '⚡',
  is_new        boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table public.town_events enable row level security;
create policy "Users can manage their town events"
  on public.town_events for all using (auth.uid() = user_id);

-- ─── Chat messages table ──────────────────────────────────────────────────────
create table if not exists public.chat_messages (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete cascade not null,
  character_id uuid references public.characters(id) on delete cascade not null,
  role         text not null check (role in ('user', 'character')),
  text         text not null,
  created_at   timestamptz not null default now()
);

alter table public.chat_messages enable row level security;
create policy "Users can manage their chat messages"
  on public.chat_messages for all using (auth.uid() = user_id);

-- ─── Town config table ────────────────────────────────────────────────────────
create table if not exists public.town_config (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade not null unique,
  town_name   text not null default 'My Town',
  days_passed int not null default 1,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.town_config enable row level security;
create policy "Users can manage their town config"
  on public.town_config for all using (auth.uid() = user_id);
