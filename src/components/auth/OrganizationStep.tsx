import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Building2, Search, Plus, MapPin, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface Organization {
    id: string;
    name: string;
    address: string | null;
    is_verified: boolean;
}

interface OrganizationStepProps {
    onBack: () => void;
    onComplete: (orgId: string) => void;
}

export default function OrganizationStep({ onBack, onComplete }: OrganizationStepProps) {
    const [mode, setMode] = useState<'search' | 'create'>('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

    // Create Form State
    const [newName, setNewName] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setResults([]);
            return;
        }

        const searchOrgs = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('organizations')
                .select('id, name, address, is_verified')
                .ilike('name', `%${searchQuery}%`)
                .limit(5);

            if (data) setResults(data);
            setLoading(false);
        };

        const timeoutId = setTimeout(searchOrgs, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const { data, error } = await supabase
                .from('organizations')
                .insert({
                    name: newName,
                    address: newAddress,
                    contact_email: newEmail,
                    is_verified: false // MVP: Auto-unverified
                })
                .select()
                .single();

            if (error) throw error;
            if (data) {
                onComplete(data.id);
            }
        } catch (error: any) {
            console.error('Error creating org:', error);
            if (error.code === '23505') { // Unique violation
                alert('An organization with this name already exists. Please search for it.');
            } else {
                alert('Failed to create organization. Please try again.');
            }
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="max-w-xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={onBack}
                className="mb-8 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors font-bold text-sm uppercase tracking-widest"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Role Selection
            </button>

            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 mb-4 text-indigo-600">
                    <Building2 className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Find Your Organization</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Connect with your school or institution to start deploying classes.</p>
            </div>

            {mode === 'search' ? (
                <div className="space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for your school..."
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all font-bold text-slate-900 dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        {loading && (
                            <div className="text-center py-4 text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">Searching Database...</div>
                        )}

                        {!loading && searchQuery.length >= 2 && results.length === 0 && (
                            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500 font-medium mb-4">No organizations found.</p>
                                <button
                                    onClick={() => setMode('create')}
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                                >
                                    Create New Organization
                                </button>
                            </div>
                        )}

                        {results.map((org) => (
                            <div
                                key={org.id}
                                onClick={() => setSelectedOrg(org)}
                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedOrg?.id === org.id
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10'
                                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                                            {org.name}
                                            {org.is_verified && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                        </h3>
                                        {org.address && (
                                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                                <MapPin className="w-3 h-3" /> {org.address}
                                            </p>
                                        )}
                                    </div>
                                    {selectedOrg?.id === org.id && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onComplete(org.id);
                                            }}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                                        >
                                            Confirm
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {results.length > 0 && (
                        <div className="text-center pt-4">
                            <button
                                onClick={() => setMode('create')}
                                className="text-sm font-bold text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-widest flex items-center justify-center mx-auto gap-2"
                            >
                                <Plus className="w-4 h-4" /> Not found? Create New
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <form onSubmit={handleCreate} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Organization Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-0 font-bold" placeholder="e.g. Springfield High School" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input required type="text" value={newAddress} onChange={e => setNewAddress(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-0 font-medium" placeholder="City, State" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Contact Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-0 font-medium" placeholder="admin@school.edu" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setMode('search')}
                            className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={creating}
                            className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {creating ? 'Creating...' : 'Register Org'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
