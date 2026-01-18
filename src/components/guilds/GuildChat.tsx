import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Send } from 'lucide-react';
import UserAvatar from '../common/UserAvatar';

interface Props {
    guildId: string;
}

interface Message {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
        full_name: string | null;
        username: string | null;
        avatar_url: string | null;
    } | null;
}

export default function GuildChat({ guildId }: Props) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (loading === false) {
            scrollToBottom();
        }
    }, [messages, loading]);

    useEffect(() => {
        if (!guildId) return;

        // Fetch initial messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('guild_messages')
                .select('*, profiles(full_name, username, avatar_url)')
                .eq('guild_id', guildId)
                .order('created_at', { ascending: true })
                .limit(50)
                .returns<Message[]>();

            if (error) {
                console.error('Error fetching messages:', error);
            } else {
                setMessages(data || []);
            }
            setLoading(false);
        };

        fetchMessages();

        // Subscription
        const channel = supabase
            .channel(`guild_chat:${guildId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'guild_messages',
                    filter: `guild_id=eq.${guildId}`
                },
                async (payload) => {
                    // Fetch user profile for new message
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('full_name, username, avatar_url')
                        .eq('id', payload.new.user_id)
                        .single();

                    const newMsg: Message = {
                        ...payload.new as any,
                        profiles: profile
                    };

                    setMessages(prev => [...prev, newMsg]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [guildId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const content = newMessage.trim();
        setNewMessage(''); // Optimistic clear

        try {
            const { error } = await supabase
                .from('guild_messages')
                .insert({
                    guild_id: guildId,
                    user_id: user.id,
                    content: content
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error sending message:', error);
            setNewMessage(content); // Restore on error
            alert('Failed to send message');
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-400">Loading chat...</div>;

    return (
        <div className="flex flex-col h-[500px]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-900 rounded-t-[32px]">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl">👋</span>
                        </div>
                        <p className="font-bold">No transmissions yet.</p>
                        <p className="text-xs uppercase tracking-widest mt-1">Initiate secure uplink.</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.user_id === user?.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`flex max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                                    {/* Avatar */}
                                    <div className="flex-shrink-0 mb-1">
                                        <UserAvatar
                                            avatarUrl={msg.profiles?.avatar_url}
                                            fullName={msg.profiles?.full_name}
                                            email={msg.profiles?.username}
                                            size="sm"
                                            className="rounded-xl border-2 border-white dark:border-slate-700 shadow-sm"
                                        />
                                    </div>

                                    {/* Bubble */}
                                    <div className={`px-5 py-3 rounded-2xl shadow-sm ${isMe
                                        ? 'bg-gradient-to-br from-primary-600 to-indigo-600 text-white rounded-tr-sm'
                                        : 'bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-sm'
                                        }`}>
                                        {!isMe && (
                                            <div className="text-[10px] font-black uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-1">
                                                {msg.profiles?.full_name || 'Anonymous Operative'}
                                            </div>
                                        )}
                                        <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 self-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 rounded-b-[32px] flex items-center gap-3">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Transmit message..."
                    className="flex-1 px-5 py-3 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 focus:border-primary-500 outline-none transition-all focus:ring-4 focus:ring-primary-500/10"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl shadow-lg hover:shadow-primary-500/25 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
