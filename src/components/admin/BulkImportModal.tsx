import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import { Upload, Download, AlertCircle, X } from 'lucide-react';

type Certification = Database['public']['Tables']['certifications']['Row'];

interface Props {
    certification: Certification;
    onClose: () => void;
    onImportComplete: () => void;
}

export default function BulkImportModal({ certification, onClose, onImportComplete }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState({ total: 0, current: 0, errors: 0 });
    const [logs, setLogs] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const downloadTemplate = () => {
        const headers = ['Objective', 'Question Text', 'Type (MC/TF)', 'Points', 'Correct Answer', 'Wrong Answer 1', 'Wrong Answer 2', 'Wrong Answer 3'];
        const exampleRow = ['Hardware', 'Which component stores data permanently?', 'MC', '10', 'Hard Drive', 'RAM', 'CPU', 'Cache'];

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + exampleRow.join(",");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "question_import_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Simple CSV Parser that handles quotes
    const parseCSV = (text: string) => {
        const rows: string[][] = [];
        let currentRow: string[] = [];
        let currentField = '';
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    currentField += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                currentRow.push(currentField.trim());
                currentField = '';
            } else if ((char === '\n' || char === '\r') && !inQuotes) {
                if (currentField || currentRow.length > 0) {
                    currentRow.push(currentField.trim());
                    rows.push(currentRow);
                }
                currentRow = [];
                currentField = '';
                if (char === '\r' && nextChar === '\n') i++;
            } else {
                currentField += char;
            }
        }
        if (currentField || currentRow.length > 0) {
            currentRow.push(currentField.trim());
            rows.push(currentRow);
        }
        return rows;
    };

    const processFile = async () => {
        if (!file) return;
        setUploading(true);
        setLogs([]);

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert('File too large. Max 10MB.');
            setUploading(false);
            return;
        }

        const text = await file.text();
        const rows = parseCSV(text);

        // Remove header
        const dataRows = rows.slice(1).filter(r => r.length >= 5); // Ensure min required fields

        setProgress({ total: dataRows.length, current: 0, errors: 0 });

        // Cache existing objectives to minimize reads
        const { data: existingObjs } = await supabase
            .from('objectives')
            .select('id, title')
            .eq('certification_id', certification.id);

        const objectiveMap = new Map<string, string>();
        existingObjs?.forEach(obj => objectiveMap.set(obj.title.toLowerCase().trim(), obj.id));

        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            const [objName, qText, typeRaw, pointsRaw, correctAns, ...wrongAns] = row;

            try {
                // 1. Resolve Objective
                let objectiveId = objectiveMap.get(objName.toLowerCase().trim());

                if (!objectiveId) {
                    // Create new objective
                    const { data: newObj, error: objError } = await supabase
                        .from('objectives')
                        .insert({ title: objName.trim(), certification_id: certification.id })
                        .select()
                        .single();

                    if (objError) throw new Error(`Failed to create objective '${objName}': ${objError.message}`);
                    if (newObj) {
                        objectiveId = newObj.id;
                        objectiveMap.set(objName.toLowerCase().trim(), newObj.id);
                        setLogs(prev => [...prev, `Created new objective: ${objName}`]);
                    }
                }

                // 2. Create Question
                const { data: question, error: qError } = await supabase
                    .from('questions')
                    .insert({
                        objective_id: objectiveId,
                        text: qText,
                        type: typeRaw.toLowerCase().includes('short') ? 'short_answer' :
                            typeRaw.toLowerCase().includes('true') ? 'true_false' : 'multiple_choice',
                        points: parseInt(pointsRaw) || 10
                    })
                    .select()
                    .single();

                if (qError) throw new Error(`Question Error: ${qError.message}`);
                if (!question) throw new Error('Failed to create question');

                // 3. Create Answers
                const answersToInsert = [
                    { question_id: question.id, text: correctAns, is_correct: true },
                    ...wrongAns.filter(a => a && a.trim() !== '').map(text => ({
                        question_id: question.id,
                        text: text,
                        is_correct: false
                    }))
                ];

                const { error: aError } = await supabase
                    .from('answers')
                    .insert(answersToInsert);

                if (aError) throw new Error(`Answer Error: ${aError.message}`);

                setProgress(prev => ({ ...prev, current: prev.current + 1 }));

            } catch (err: any) {
                console.error(err);
                setProgress(prev => ({ ...prev, current: prev.current + 1, errors: prev.errors + 1 }));
                setLogs(prev => [...prev, `Row ${i + 2} Error: ${err.message}`]);
            }
        }

        setUploading(false);
        setLogs(prev => [...prev, 'Import complete!']);
        setTimeout(() => {
            onImportComplete();
        }, 2000);
    };

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={!uploading ? onClose : undefined}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Bulk Import Questions</h3>
                        {!uploading && (
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="h-6 w-6" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* Step 1: Template */}
                        <div className="bg-blue-50 p-4 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">Instructions</h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <p>1. Download the template CSV.</p>
                                        <p>2. Fill in your questions. New Objectives will be created automatically.</p>
                                        <p>3. Upload the file below.</p>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={downloadTemplate}
                                            className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download Template
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Upload */}
                        {!uploading && progress.total === 0 && (
                            <div
                                className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                            {file ? file.name : 'Upload a file'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">CSV up to 10MB</p>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".csv"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                            </div>
                        )}

                        {/* Progress */}
                        {(uploading || progress.total > 0) && (
                            <div className="mt-4">
                                <div className="flex justify-between text-sm font-medium text-gray-900 mb-1">
                                    <span>Processing...</span>
                                    <span>{progress.current} / {progress.total}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${(progress.current / Math.max(progress.total, 1)) * 100}%` }}
                                    ></div>
                                </div>
                                {progress.errors > 0 && (
                                    <p className="mt-2 text-sm text-red-600">{progress.errors} errors occurred.</p>
                                )}
                            </div>
                        )}

                        {/* Logs */}
                        {logs.length > 0 && (
                            <div className="mt-4 bg-gray-50 p-2 rounded-md h-32 overflow-y-auto text-xs font-mono text-gray-600 border border-gray-200">
                                {logs.map((log, i) => (
                                    <div key={i}>{log}</div>
                                ))}
                            </div>
                        )}

                        <div className="mt-5 sm:mt-6">
                            {!uploading && progress.total === 0 ? (
                                <button
                                    type="button"
                                    disabled={!file}
                                    onClick={processFile}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                                >
                                    Start Import
                                </button>
                            ) : !uploading && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none"
                                >
                                    Done
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
