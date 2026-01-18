
import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

interface WeaknessData {
    objective_id: string;
    objective_title: string;
    accuracy: number;
    correct_count: number;
    total_attempts: number;
}

interface Props {
    data: WeaknessData[];
}

export default function WeaknessHeatmap({ data }: Props) {
    // Sort by accuracy (lowest first to highlight weaknesses)
    const sortedData = [...data].sort((a, b) => a.accuracy - b.accuracy);

    if (data.length === 0) {
        return (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-400 font-bold">No analytic data available yet.</p>
                <p className="text-xs text-slate-400 mt-1">Students need to take quizzes to generate insights.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {sortedData.map((item) => {
                const getStatusColor = (acc: number) => {
                    if (acc >= 80) return "bg-emerald-500";
                    if (acc >= 60) return "bg-amber-500";
                    return "bg-rose-500";
                };

                const getStatusText = (acc: number) => {
                    if (acc >= 80) return "Mastery";
                    if (acc >= 60) return "Developing";
                    return "Critical Weakness";
                };

                const getIcon = (acc: number) => {
                    if (acc >= 80) return <CheckCircle className="w-5 h-5 text-emerald-500" />;
                    if (acc >= 60) return <HelpCircle className="w-5 h-5 text-amber-500" />;
                    return <AlertCircle className="w-5 h-5 text-rose-500" />;
                };

                return (
                    <div key={item.objective_id} className="relative group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                {getIcon(item.accuracy)}
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{item.objective_title}</h4>
                                    <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                                        {getStatusText(item.accuracy)} • {item.total_attempts} Attempts
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-2xl font-black ${item.accuracy >= 80 ? 'text-emerald-500' : item.accuracy >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                                    {item.accuracy}%
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar Background */}
                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${getStatusColor(item.accuracy)} transition-all duration-1000 ease-out`}
                                style={{ width: `${item.accuracy}%` }}
                            ></div>
                        </div>

                        {/* Tooltip (Simple using Title for now, usually custom React component) */}
                        <div className="absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Actions could go here */}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
