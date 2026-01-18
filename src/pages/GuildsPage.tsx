import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import { Users, Plus, Search, LogIn } from 'lucide-react';
import type { Database } from '../types/supabase';

type Guild = Database['public']['Tables']['guilds']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export default function GuildsPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [myGuilds, setMyGuilds] = useState<Guild[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGuildName, setNewGuildName] = useState('');
    const [newGuildDesc, setNewGuildDesc] = useState('');

    useEffect(() => {
        async function loadData() {
            if (!user) return;

            // Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(profileData);

            // Fetch All Public Guilds
            const { data: allGuilds } = await supabase
                .from('guilds')
                .select('*')
                .eq('is_private', false)
                .order('created_at', { ascending: false });
            setGuilds(allGuilds || []);

            // Fetch My Guilds
            const { data: memberData } = await supabase
                .from('guild_members')
                .select('guild_id')
                .eq('user_id', user.id);

            if (memberData && memberData.length > 0) {
                const guildIds = memberData.map(m => m.guild_id);
                const { data: myHealthData } = await supabase
                    .from('guilds')
                    .select('*')
                    .in('id', guildIds);
                setMyGuilds(myHealthData || []);
            }

            setLoading(false);
        }
        loadData();
    }, [user]);

    const handleCreateGuild = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newGuildName) return;

        try {
            // 1. Create Guild
            const { data: guild, error } = await supabase
                .from('guilds')
                .insert({
                    name: newGuildName,
                    description: newGuildDesc,
                    leader_id: user.id
                })
                .select()
                .single();

            if (error) throw error;
            if (!guild) throw new Error("Failed to create guild");

            // 2. Add Leader as Member
            await supabase
                .from('guild_members')
                .insert({
                    guild_id: guild.id,
                    user_id: user.id,
                    role: 'leader'
                });

            // Update local state
            setMyGuilds([guild, ...myGuilds]);
            setGuilds([guild, ...guilds]);
            setShowCreateModal(false);
            setNewGuildName('');
            setNewGuildDesc('');
        } catch (error) {
            console.error('Error creating guild:', error);
            alert('Failed to create guild.');
        }
    };

    const handleJoinGuild = async (guildId: string) => {
        if (!user) return;

        // check if already member
        if (myGuilds.some(g => g.id === guildId)) {
            alert('You are already a member of this guild.');
            return;
        }

        const { error } = await supabase
            .from('guild_members')
            .insert({
                guild_id: guildId,
                user_id: user.id,
                role: 'member'
            });

        if (error) {
            console.error('Error joining guild:', error);
            alert('Failed to join guild.');
        } else {
            // Optimistic update
            const joinedGuild = guilds.find(g => g.id === guildId);
            if (joinedGuild) {
                setMyGuilds([...myGuilds, joinedGuild]);
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20 relative overflow-hidden">
            <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-500/5 blur-[120px] rounded-full"></div>
            <Navbar profile={profile} />

            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-24 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                            Guild <span className="text-primary-600 dark:text-primary-400">Network</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium italic text-sm">Collaborate with fellow students to master certifications.</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="group flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-3xl shadow-xl hover:shadow-primary-500/25 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
                        Create Guild
                    </button>
                </div>

                {/* My Guilds Section */}
                {myGuilds.length > 0 && (
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Your Active Guilds</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {myGuilds.map(guild => (
                                <div key={guild.id} className="bg-white dark:bg-slate-900 rounded-[32px] shadow-premium p-8 flex flex-col border border-white dark:border-slate-800 hover:border-primary-500/30 transition-all group relative overflow-hidden">
                                    {/* Accent Glow */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner group-hover:scale-110 transition-transform">
                                                <Users className="w-7 h-7" />
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{guild.name}</h3>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Authorized Member</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-8 line-clamp-3">
                                        {guild.description || "Collaborative group for intelligence gathering."}
                                    </p>
                                    <button
                                        onClick={() => window.location.href = `/guilds/${guild.id}`}
                                        className="w-full py-3.5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-sm font-black hover:bg-white dark:hover:bg-slate-800 hover:border-primary-500 transition-all">
                                        Access Dashboard
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Browse Guilds Section */}
                <div>
                    <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight shrink-0">Available Hubs</h2>
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <input
                                type="text"
                                placeholder="Scan for active guilds..."
                                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:border-primary-500 outline-none shadow-sm transition-all group-hover:shadow-md"
                            />
                            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {guilds.filter(g => !myGuilds.some(mg => mg.id === g.id)).map(guild => (
                            <div key={guild.id} className="bg-white dark:bg-slate-900 rounded-[32px] shadow-premium p-8 flex flex-col border border-white dark:border-slate-800 hover:border-primary-500/30 transition-all group relative">
                                <div className="flex items-center mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/10 group-hover:text-primary-500 transition-all">
                                        <Users className="w-7 h-7" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{guild.name}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Open Frequency</p>
                                    </div>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-8 line-clamp-3 italic">
                                    {guild.description || "Global intelligence hub seeking new operatives for high-stakes certification training."}
                                </p>
                                <button
                                    onClick={() => handleJoinGuild(guild.id)}
                                    className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl shadow-lg hover:shadow-primary-500/25 active:scale-95 transition-all outline-none"
                                >
                                    <LogIn className="w-4 h-4 mr-2" /> Request Ingress
                                </button>
                            </div>
                        ))}
                    </div>

                    {guilds.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No guilds found. Be the first to create one!
                        </div>
                    )}
                </div>
            </div>

            {/* Create Guild Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-premium max-w-md w-full p-8 animate-in fade-in zoom-in duration-200 border border-white dark:border-slate-800">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Create Guild</h2>
                            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400">
                                <Plus className="w-6 h-6" />
                            </div>
                        </div>

                        <form onSubmit={handleCreateGuild}>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Guild Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                        placeholder="e.g. Cyber Security Elite"
                                        value={newGuildName}
                                        onChange={e => setNewGuildName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                                    <textarea
                                        className="w-full px-4 py-3 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:border-primary-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 resize-none"
                                        rows={4}
                                        placeholder="Brief the mission objective..."
                                        value={newGuildDesc}
                                        onChange={e => setNewGuildDesc(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mt-10 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-4 text-sm font-black text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-2xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-4 text-sm font-black text-white bg-primary-600 hover:bg-primary-500 rounded-2xl shadow-lg hover:shadow-primary-500/25 transition-all active:scale-95"
                                >
                                    Initialize
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
