import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Papa from 'papaparse';
import { FileUp, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface RosterUploaderProps {
    classId: string;
    onUploadComplete: () => void;
}

interface CSVRow {
    email: string;
    [key: string]: string; // Allow other columns but ignore them
}

export default function RosterUploader({ classId, onUploadComplete }: RosterUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setResults(null);

        Papa.parse<CSVRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const rows = results.data;
                let successCount = 0;
                let failCount = 0;
                const errorMessages: string[] = [];

                if (!rows.length) {
                    setResults({ success: 0, failed: 0, errors: ['CSV file is empty'] });
                    setUploading(false);
                    return;
                }

                // Verify headers
                const headers = results.meta.fields || [];
                if (!headers.map(h => h.toLowerCase()).includes('email')) {
                    setResults({ success: 0, failed: 0, errors: ['CSV must have an "email" column'] });
                    setUploading(false);
                    return;
                }

                for (const row of rows) {
                    const email = row.email?.trim();
                    if (!email) continue;

                    try {
                        // 1. Find User by Email
                        const { data: profile, error: profileError } = await supabase
                            .from('profiles')
                            .select('id')
                            .ilike('email', email) // Case-insensitive match mainly
                            .single();

                        if (profileError || !profile) {
                            failCount++;
                            errorMessages.push(`${email}: User not found`);
                            continue;
                        }

                        // 2. Insert Enrollment
                        const { error: enrollError } = await supabase
                            .from('class_enrollments')
                            .insert({
                                class_id: classId,
                                student_id: profile.id
                            });

                        if (enrollError) {
                            if (enrollError.code === '23505') { // Unique constraint violation
                                errorMessages.push(`${email}: Already enrolled`);
                                // Consider this a "soft fail" or ignore
                                failCount++;
                            } else {
                                failCount++;
                                errorMessages.push(`${email}: ${enrollError.message}`);
                            }
                        } else {
                            successCount++;
                        }

                    } catch (err: any) {
                        failCount++;
                        errorMessages.push(`${email}: Unexpected error`);
                    }
                }

                setResults({
                    success: successCount,
                    failed: failCount,
                    errors: errorMessages
                });
                setUploading(false);
                if (successCount > 0) {
                    onUploadComplete();
                }
            },
            error: (error) => {
                setResults({ success: 0, failed: 0, errors: [error.message] });
                setUploading(false);
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center hover:border-indigo-500/50 transition-colors">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="roster-upload"
                    disabled={uploading}
                />
                <label htmlFor="roster-upload" className={`cursor-pointer flex flex-col items-center ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploading ? (
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                    ) : (
                        <FileUp className="w-12 h-12 text-slate-400 mb-4" />
                    )}
                    <span className="text-lg font-bold text-slate-700 dark:text-slate-200">
                        {uploading ? 'Processing Roster...' : 'Click to Upload CSV'}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Must contain an <code>email</code> column
                    </span>
                </label>
            </div>

            {results && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Success</p>
                                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{results.success}</p>
                            </div>
                        </div>
                        <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800 flex items-center gap-3">
                            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                            <div>
                                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Failed</p>
                                <p className="text-2xl font-black text-rose-700 dark:text-rose-300">{results.failed}</p>
                            </div>
                        </div>
                    </div>

                    {results.errors.length > 0 && (
                        <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 max-h-40 overflow-y-auto text-sm">
                            <p className="font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Error Log
                            </p>
                            <ul className="space-y-1 text-slate-500 dark:text-slate-400 font-mono text-xs">
                                {results.errors.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

