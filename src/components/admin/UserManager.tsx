import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import { Search, Shield, User, GraduationCap, ChevronLeft, Save } from 'lucide-react';

type Profile = Database['public']['Tables']['profiles']['Row'] & {
    email?: string; // Often joined or stored, but we'll try to fetch it or rely on profile data
};

interface Props {
    onBack: () => void;
}

export default function UserManager({ onBack }: Props) {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<Profile | null>(null);
    const [newRole, setNewRole] = useState<string>('student');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        // Note: 'email' is usually in auth.users, not public.profiles, unless we have a sync trigger.
        // For this MVP, we'll assume profiles has the info we need or we just show names.
        // We'll try to select everything.
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, role, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching users:', error);
        } else {
            setUsers(data as Profile[]);
        }
        setLoading(false);
    };

    const handleUpdateRole = async () => {
        if (!editingUser) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole as any }) // Type cast if enum isn't perfectly matched in generated types yet
                .eq('id', editingUser.id);

            if (error) throw error;

            // Update local state
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, role: newRole as any } : u));
            setEditingUser(null);
        } catch (error: any) {
            console.error('Error updating role:', error);
            alert('Failed to update role: ' + error.message);
        }
    };

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.includes(searchTerm)
    );

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <Shield className="h-4 w-4 text-rose-500" />;
            case 'teacher': return <GraduationCap className="h-4 w-4 text-indigo-500" />;
            default: return <User className="h-4 w-4 text-slate-500" />;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/50';
            case 'teacher': return 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/50';
            default: return 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800';
        }
    };

    return (
        <>
            <div className="space-y-6 fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            onClick={onBack}
                            className="group flex items-center text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </button>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">User Management</h2>
                        <p className="text-slate-500 font-medium">Manage user roles and permissions</p>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border-none rounded-xl bg-white dark:bg-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500 w-64 text-sm font-medium"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    </div>
                </div>

                {/* User List */}
                <div className="bg-white dark:bg-slate-900 shadow-premium rounded-[24px] border border-white dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm whitespace-nowrap">
                            <thead className="uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-black text-slate-400">User</th>
                                    <th scope="col" className="px-6 py-4 font-black text-slate-400">Role</th>
                                    <th scope="col" className="px-6 py-4 font-black text-slate-400">Joined</th>
                                    <th scope="col" className="px-6 py-4 font-black text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold italic">Loading users...</td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold italic">No users found.</td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-900 dark:text-white font-bold">
                                                <div className="flex flex-col">
                                                    <span>{user.full_name || 'Anonymous User'}</span>
                                                    <span className="text-xs text-slate-400 font-medium font-mono">{user.id.slice(0, 8)}...</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-widest border ${getRoleBadgeColor(user.role)}`}>
                                                    {getRoleIcon(user.role)}
                                                    <span className="ml-1.5">{user.role}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-medium tabular-nums">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setEditingUser(user);
                                                        setNewRole(user.role);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-500 font-bold text-xs uppercase tracking-wide px-3 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                                                >
                                                    Edit Role
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Edit Role Modal */}
            {editingUser && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setEditingUser(null)}></div>

                        <div className="relative bg-white dark:bg-slate-900 rounded-[32px] px-8 pt-8 pb-8 text-left overflow-hidden shadow-premium transform transition-all sm:my-8 sm:max-w-md sm:w-full border border-white dark:border-slate-800">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Edit User Role</h3>
                                <p className="text-slate-500 font-medium mb-6">Change role for <span className="text-slate-900 dark:text-white font-bold">{editingUser.full_name}</span></p>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-3">
                                        {['student', 'teacher', 'admin'].map((role) => (
                                            <div
                                                key={role}
                                                onClick={() => setNewRole(role)}
                                                className={`cursor-pointer px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all ${newRole === role
                                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                                    : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800'
                                                    }`}
                                            >
                                                <div className="flex items-center">
                                                    {getRoleIcon(role)}
                                                    <span className="ml-3 font-bold uppercase tracking-wider text-sm text-slate-700 dark:text-slate-300">{role}</span>
                                                </div>
                                                {newRole === role && <div className="h-2 w-2 rounded-full bg-indigo-500"></div>}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 flex gap-4">
                                        <button
                                            type="button"
                                            className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-3 bg-indigo-600 text-base font-black text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm active:scale-95 transition-all"
                                            onClick={handleUpdateRole}
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            className="w-full inline-flex justify-center rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm px-6 py-3 bg-white dark:bg-slate-800 text-base font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none sm:text-sm transition-colors"
                                            onClick={() => setEditingUser(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
