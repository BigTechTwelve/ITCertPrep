import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Award, ChevronRight, Book, ArrowLeft } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../contexts/AuthContext';

interface Certification {
    id: string;
    title: string;
    provider: string;
}

export default function CertificationsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCerts() {
            try {
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();
                    setProfile(profile);
                }

                const { data, error } = await supabase
                    .from('certifications')
                    .select('*')
                    .order('title');

                if (error) throw error;
                setCertifications(data || []);
            } catch (err) {
                console.error('Error fetching certifications:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchCerts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[var(--bg-app)] transition-colors duration-300">
            <Navbar profile={profile} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-24">
                <div className="space-y-8 fade-in">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 shadow-sm transition-all hover:scale-110"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Certifications</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">
                                Professional Advancement
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-[32px] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {certifications.map((cert) => (
                                <div
                                    key={cert.id}
                                    onClick={() => navigate(`/certification/${cert.id}`)}
                                    className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-premium transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                        <Award className="h-32 w-32 text-indigo-500" />
                                    </div>

                                    <div className="relative z-10">
                                        <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-black uppercase tracking-widest mb-4">
                                            {cert.provider}
                                        </span>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {cert.title}
                                        </h3>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">
                                            Comprehensive study path
                                        </p>

                                        <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                                            <Book className="h-4 w-4 mr-2" />
                                            <span>Start Studying</span>
                                            <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {certifications.length === 0 && (
                                <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                                    <Award className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500 font-bold">No certifications available yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
