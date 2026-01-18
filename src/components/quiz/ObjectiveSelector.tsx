import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Check, ChevronRight, Layers } from 'lucide-react';

interface Objective {
    id: string;
    title: string;
}

interface ObjectiveSelectorProps {
    certificationId: string;
    onStart: (selectedObjectiveIds: string[]) => void;
    onCancel: () => void;
}

export default function ObjectiveSelector({ certificationId, onStart, onCancel }: ObjectiveSelectorProps) {
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchObjectives() {
            const { data } = await supabase
                .from('objectives')
                .select('id, title')
                .eq('certification_id', certificationId)
                .order('title');

            if (data) {
                setObjectives(data);
                // Default to all selected? Or none? Let's default to ALL for ease.
                setSelectedIds(new Set(data.map(o => o.id)));
            }
            setLoading(false);
        }
        fetchObjectives();
    }, [certificationId]);

    const toggleObjective = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const handleSelectAll = () => {
        if (selectedIds.size === objectives.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(objectives.map(o => o.id)));
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-400">Loading objectives...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden fade-in border border-slate-200 dark:border-slate-800">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Select Topics</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Customize your quiz by choosing specific domains.</p>
            </div>

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleSelectAll}
                    className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline"
                >
                    {selectedIds.size === objectives.length ? 'Deselect All' : 'Select All'}
                </button>
            </div>

            <div className="space-y-3 mb-10 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {objectives.map((obj) => {
                    const isSelected = selectedIds.has(obj.id);
                    return (
                        <button
                            key={obj.id}
                            onClick={() => toggleObjective(obj.id)}
                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${isSelected
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                }`}
                        >
                            <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors ${isSelected ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                    }`}>
                                    <Layers className="w-5 h-5" />
                                </div>
                                <span className={`font-bold ${isSelected ? 'text-primary-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {obj.title}
                                </span>
                            </div>
                            {isSelected && (
                                <div className="p-1 bg-primary-500 rounded-full text-white">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onCancel}
                    className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={() => onStart(Array.from(selectedIds))}
                    disabled={selectedIds.size === 0}
                    className="flex-[2] py-4 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl shadow-lg hover:shadow-primary-500/25 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center"
                >
                    Start Quiz <ChevronRight className="ml-2 w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
