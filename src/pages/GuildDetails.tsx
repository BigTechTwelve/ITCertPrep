import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Users, Trophy, LogOut, MessageSquare } from 'lucide-react';
import GuildChat from '../components/guilds/GuildChat';
import UserAvatar from '../components/common/UserAvatar';
import type { Database } from '../types/supabase';

type Guild = Database['public']['Tables']['guilds']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type GuildMember = Database['public']['Tables']['guild_members']['Row'] & {
    profiles: Profile
};

export default function GuildDetails() {
    const { guildId } = useParams<{ guildId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [guild, setGuild] = useState<Guild | null>(null);
    const [members, setMembers] = useState<GuildMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        async function loadData() {
            if (!user || !guildId) return;

            // 2. Fetch Guild Details
            const { data: guildData, error: guildError } = await supabase
                .from('guilds')
                .select('*')
                .eq('id', guildId)
                .single();

            if (guildError || !guildData) {
                console.error('Error fetching guild:', guildError);
                navigate('/guilds');
                return;
            }
            setGuild(guildData);

            // 3. Fetch Members with Profile Data
            const { data: membersData, error: membersError } = await supabase
                .from('guild_members')
                .select('*, profiles(*)')
                .eq('guild_id', guildId);

            if (membersError) {
                console.error('Error fetching members:', membersError);
            }

            if (membersData) {
                // Cast because Supabase join types can be tricky
                const typedMembers = membersData as unknown as GuildMember[];
                // Sort by points (Leaderboard)
                typedMembers.sort((a, b) => (b.profiles?.points || 0) - (a.profiles?.points || 0));
                setMembers(typedMembers);

                setIsMember(typedMembers.some(m => m.user_id === user.id));
            }

            setLoading(false);
        }
        loadData();
    }, [guildId, user, navigate]);

    const handleJoin = async () => {
        if (!user || !guildId) return;

        const { error } = await supabase
            .from('guild_members')
            .insert({
                guild_id: guildId,
                user_id: user.id,
                role: 'member'
            });

        if (!error) {
            setIsMember(true);
            // Reload to get updated list
            window.location.reload();
        }
    };

    const handleLeave = async () => {
        if (!user || !guildId) return;
        if (!window.confirm("Are you sure you want to leave this guild?")) return;

        const { error } = await supabase
            .from('guild_members')
            .delete()
            .eq('guild_id', guildId)
            .eq('user_id', user.id);

        if (!error) {
            navigate('/guilds');
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading interface...</div>;
    if (!guild) return <div className="h-screen flex items-center justify-center">Sector not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-24 pb-24 relative z-10">
                {/* Header Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-premium overflow-hidden mb-12 border border-white dark:border-slate-800 transition-all hover:shadow-2xl">
                    <div className="h-48 bg-gradient-to-r from-primary-600 via-indigo-700 to-violet-800 relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    </div>
                    <div className="px-12 pb-10">
                        <div className="relative flex flex-col md:flex-row justify-between items-center md:items-end -mt-16 gap-6">
                            <div className="flex flex-col md:flex-row items-center md:items-end text-center md:text-left">
                                <div className="w-32 h-32 rounded-[32px] bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 p-4 border-4 border-white dark:border-slate-900 group">
                                    <Users className="w-16 h-16 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="md:ml-8 mb-2">
                                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase">{guild.name}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-4">
                                        <div className="flex items-center text-slate-500 dark:text-slate-400 font-bold text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                            <Users className="w-4 h-4 mr-2" /> {members.length} Members
                                        </div>
                                        <div className="flex items-center text-amber-500 font-bold text-sm bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                                            <Trophy className="w-4 h-4 mr-2" /> Tier 1 Guild
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2 flex gap-4">
                                {!isMember ? (
                                    <button
                                        onClick={handleJoin}
                                        className="px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl shadow-xl hover:shadow-primary-500/25 transition-all active:scale-95"
                                    >
                                        Request Ingress
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleLeave}
                                        className="flex items-center px-8 py-4 border-2 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-black rounded-2xl transition-all"
                                    >
                                        <LogOut className="w-5 h-5 mr-2" /> Sever Connection
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="mt-10 text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-4xl italic">
                            {guild.description || "Sector data stream not initialized."}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Leaderboard */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-premium border border-white dark:border-slate-800 overflow-hidden">
                            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center uppercase tracking-widest">
                                    <Trophy className="w-6 h-6 text-amber-500 mr-3" />
                                    Sector Rankings
                                </h2>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Efficiency Yield</span>
                            </div>
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                {members.map((member, index) => (
                                    <div key={member.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className={`
                                                w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border
                                                ${index === 0 ? 'bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-900/50 dark:text-amber-400' :
                                                    index === 1 ? 'bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300' :
                                                        index === 2 ? 'bg-orange-100 border-orange-200 text-orange-700 dark:bg-orange-900/30 dark:border-orange-900/50 dark:text-orange-400' :
                                                            'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 font-bold'}
                                            `}>
                                                #{index + 1}
                                            </div>
                                            <div className="flex items-center">
                                                <UserAvatar
                                                    avatarUrl={member.profiles.avatar_url}
                                                    fullName={member.profiles.full_name}
                                                    email={member.profiles.email}
                                                    size="lg"
                                                    className="mr-4 shadow-inner group-hover:scale-105 transition-transform"
                                                />
                                                <div>
                                                    <p className="font-black text-slate-900 dark:text-white text-lg flex items-center">
                                                        {member.profiles.full_name || 'Anonymous'}
                                                        {member.role === 'leader' && <span className="ml-3 text-[10px] font-black bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary-200 dark:border-primary-800">Overseer</span>}
                                                    </p>
                                                    <p className="text-xs font-bold text-slate-400 tracking-wider">@{member.profiles.username || 'operative'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-black text-2xl text-slate-900 dark:text-white tabular-nums tracking-tighter">{member.profiles.points.toLocaleString()}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">XP YIELD</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Chat & Stats */}
                    <div className="space-y-12">
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-premium border border-white dark:border-slate-800 p-8">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center uppercase tracking-widest">
                                <MessageSquare className="w-6 h-6 mr-3 text-primary-500" />
                                Secure Comms
                            </h3>
                            <div className="rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner">
                                {isMember ? (
                                    <GuildChat guildId={guild.id} />
                                ) : (
                                    <div className="p-16 text-center bg-slate-50 dark:bg-slate-900/50">
                                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm mx-auto mb-6 flex items-center justify-center text-slate-300">
                                            <MessageSquare className="w-8 h-8" />
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed">Join this sector to establish a secure uplink.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Guild Stats */}
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-premium border border-white dark:border-slate-800 p-10">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-widest">Sector Metrics</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end border-b border-slate-50 dark:border-slate-800 pb-4">
                                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Aggregate Score</span>
                                    <span className="font-black text-2xl text-primary-600 dark:text-primary-400 tracking-tighter">
                                        {members.reduce((sum, m) => sum + (m.profiles?.points || 0), 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end border-b border-slate-50 dark:border-slate-800 pb-4">
                                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Inception Date</span>
                                    <span className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tight">
                                        {new Date(guild.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Activity Status</span>
                                    <span className="flex items-center text-emerald-500 font-black uppercase text-[10px] tracking-widest">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                                        Nominal
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
