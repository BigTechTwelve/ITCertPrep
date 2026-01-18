-- Create guilds table
CREATE TABLE IF NOT EXISTS public.guilds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    leader_id UUID REFERENCES auth.users(id) NOT NULL,
    is_private BOOLEAN DEFAULT false,
    join_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for guilds
ALTER TABLE public.guilds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guilds are viewable by everyone" ON public.guilds FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert guilds" ON public.guilds FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Leaders can update own guild" ON public.guilds FOR UPDATE USING (auth.uid() = leader_id);

-- Create guild_members table
CREATE TABLE IF NOT EXISTS public.guild_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    guild_id UUID REFERENCES public.guilds(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('leader', 'admin', 'member')) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(guild_id, user_id)
);

-- RLS for guild_members
ALTER TABLE public.guild_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members viewable by everyone" ON public.guild_members FOR SELECT USING (true);
CREATE POLICY "Users can join public guilds" ON public.guild_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Leaders can manage members" ON public.guild_members FOR ALL USING (
    exists (
        select 1 from public.guilds where id = guild_members.guild_id and leader_id = auth.uid()
    )
);

-- Create guild_messages table
CREATE TABLE IF NOT EXISTS public.guild_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    guild_id UUID REFERENCES public.guilds(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for messages
ALTER TABLE public.guild_messages ENABLE ROW LEVEL SECURITY;

-- Allow members to read messages
CREATE POLICY "Guild members can read messages" ON public.guild_messages
    FOR SELECT
    USING (
        exists (
            select 1 from public.guild_members
            where guild_members.guild_id = guild_messages.guild_id
            and guild_members.user_id = auth.uid()
        )
    );

-- Allow members to insert messages
CREATE POLICY "Guild members can insert messages" ON public.guild_messages
    FOR INSERT
    WITH CHECK (
        exists (
            select 1 from public.guild_members
            where guild_members.guild_id = guild_messages.guild_id
            and guild_members.user_id = auth.uid()
        )
    );

-- Realtime subscription
alter publication supabase_realtime add table guild_messages;
