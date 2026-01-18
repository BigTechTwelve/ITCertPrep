import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, PlayCircle, Target, Trophy } from 'lucide-react';

interface Objective {
    id: string;
    title: string;
}

interface Certification {
    id: string;
    title: string;
    provider: string;
}

export default function CertificationDetails() {
    const { certId } = useParams<{ certId: string }>();
    const navigate = useNavigate();
    const [certification, setCertification] = useState<Certification | null>(null);
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!certId) return;
            try {
                // Fetch Cert Details
                const { data: cert, error: certError } = await supabase
                    .from('certifications')
                    .select('*')
                    .eq('id', certId)
                    .single();

                if (certError) throw certError;
                setCertification(cert);

                // Fetch Objectives
                const { data: objs, error: objError } = await supabase
                    .from('objectives')
                    .select('*')
                    .eq('certification_id', certId)
                    .order('title'); // Ideally order by some sequence field if added later

                if (objError) throw objError;
                setObjectives(objs || []);

            } catch (err) {
                console.error('Error fetching details:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [certId]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!certification) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">Certification not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[var(--bg-app)] transition-colors duration-300">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-24">
                <div className="space-y-8 fade-in">
                    {/* Header */}
                    <div>
                        <button
                            onClick={() => navigate('/certifications')}
                            className="mb-6 flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Certifications
                        </button>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-black uppercase tracking-widest mb-2">
                                    {certification.provider}
                                </span>
                                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{certification.title}</h1>
                            </div>

                            <button
                                onClick={() => navigate(`/quiz/${certification.id}`)}
                                className="flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl hover:shadow-indigo-500/25 transition-all active:scale-95"
                            >
                                <Trophy className="h-5 w-5 mr-3" />
                                Full Practice Exam
                            </button>
                        </div>
                    </div>

                    {/* Domains / Objectives Grid */}
                    <div className="grid gap-6">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <Target className="h-5 w-5 text-indigo-500" />
                            Study Domains
                        </h2>

                        {objectives.map((obj, index) => (
                            <div key={obj.id} className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 font-black text-lg">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {obj.title}
                                        </h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            0% Mastered {/* Placeholder for logic */}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Future: Progress Bar here */}
                                    <button
                                        onClick={() => navigate(`/quiz/${certification.id}?objective=${obj.id}`)} // Need to implement this filter in QuizPage
                                        className="px-6 py-3 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/30 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 font-bold rounded-xl transition-all flex items-center"
                                    >
                                        <PlayCircle className="h-5 w-5 mr-2" />
                                        Study Domain
                                    </button>
                                </div>
                            </div>
                        ))}

                        {objectives.length === 0 && (
                            <div className="p-10 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-slate-400 font-bold italic">
                                No domains found for this certification.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
