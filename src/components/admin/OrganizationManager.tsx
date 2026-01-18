import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Trash2, ArrowLeft, Shield, MapPin, Mail, School } from 'lucide-react';

interface Organization {
    id: string;
    name: string;
    address: string | null;
    contact_email: string | null;
    is_verified: boolean;
    created_at: string;
    instructor_count?: number; // Need to join to get this
}

interface OrganizationManagerProps {
    onBack: () => void;
}

export default function OrganizationManager({ onBack }: OrganizationManagerProps) {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchOrgs();
    }, []);

    const fetchOrgs = async () => {
        try {
            const { data, error } = await supabase
                .from('organizations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrgs(data || []);
        } catch (error) {
            console.error('Error fetching orgs:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleVerification = async (org: Organization) => {
        try {
            const { error } = await supabase
                .from('organizations')
                .update({ is_verified: !org.is_verified })
                .eq('id', org.id);

            if (error) throw error;

            // Optimistic update
            setOrgs(orgs.map(o => o.id === org.id ? { ...o, is_verified: !o.is_verified } : o));
        } catch (error) {
            console.error('Error updating verification:', error);
            alert('Failed to update verification status.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete the organization and unlink all teachers/classes.')) return;

        try {
            const { error } = await supabase
                .from('organizations')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setOrgs(orgs.filter(o => o.id !== id));
        } catch (error) {
            console.error('Error deleting org:', error);
            alert('Failed to delete organization.');
        }
    };

    const filteredOrgs = orgs.filter(o =>
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-500" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Organization Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">
                        Schools & Institutions
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search organizations..."
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all font-bold text-slate-900 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredOrgs.map((org) => (
                        <div key={org.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${org.is_verified
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                    }`}>
                                    <School className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                        {org.name}
                                        {org.is_verified && <Shield className="w-4 h-4 text-emerald-500 fill-emerald-500" />}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        {org.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {org.address}</span>}
                                        {org.contact_email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {org.contact_email}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => toggleVerification(org)}
                                    className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors ${org.is_verified
                                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                        }`}
                                >
                                    {org.is_verified ? 'Revoke' : 'Verify'}
                                </button>
                                <button
                                    onClick={() => handleDelete(org.id)}
                                    className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredOrgs.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            No organizations found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
