import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Database } from '../../types/supabase';
import { Users, ChevronLeft, Copy, UserPlus, BookOpen, PlayCircle, Trash2, LayoutGrid, BarChart3, ListTodo, Upload } from 'lucide-react';
import ClassAnalytics from './ClassAnalytics';
import Navbar from '../common/Navbar';
import UserAvatar from '../common/UserAvatar';
import RosterUploader from './RosterUploader';

// Define Enrollment Type
type Enrollment = Database['public']['Tables']['class_enrollments']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'] | null
};

type Class = Database['public']['Tables']['classes']['Row'] & {
    code: string;
};

interface StudentMetrics {
    [studentId: string]: {
        totalAnswered: number;
        correctAnswers: number;
        accuracy: number;
    };
}

export default function ClassDetails() {
    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [classDetails, setClassDetails] = useState<Class | null>(null);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [metrics, setMetrics] = useState<StudentMetrics>({});
    const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'assignments'>('overview');
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        description: '',
        type: 'quiz', // 'quiz' or 'certification'
        target_id: '',
        due_date: ''
    });
    const [availableQuizzes, setAvailableQuizzes] = useState<any[]>([]);
    const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);

    // UI-only helper; access is still enforced by RLS.
    const isTeacher = user?.id === classDetails?.teacher_id;

    useEffect(() => {
        async function fetchData() {
            if (!classId) return;
            try {
                if (user) {
                    // Fetch Profile for Navbar
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();
                    setProfile(profile);
                }

                // Fetch Class Info (including code)
                const { data: cls } = await supabase
                    .from('classes')
                    .select('*')
                    .eq('id', classId)
                    .single();

                if (cls) setClassDetails(cls as Class);

                // Fetch Enrollments (with Student Profiles)
                const { data: enr } = await supabase
                    .from('class_enrollments')
                    .select(`
                    *,
                    profiles:student_id (*)
                `)
                    .eq('class_id', classId);

                // Fetch Assignments
                const { data: asm } = await supabase
                    .from('assignments')
                    .select('*')
                    .eq('class_id', classId)
                    .order('created_at', { ascending: false });

                if (asm) setAssignments(asm);

                // Fetch Content Options
                const { data: certs } = await supabase.from('certifications').select('*');
                const { data: quizzes } = await supabase.from('quizzes').select('*');

                const options: any[] = [];
                if (certs) options.push(...certs.map(c => ({ ...c, type: 'certification', provider: c.provider })));
                if (quizzes) options.push(...quizzes.map(q => ({ ...q, type: 'quiz', provider: 'Internal' })));

                setAvailableQuizzes(options);

                if (enr) {
                    setEnrollments(enr as unknown as Enrollment[]);

                    // Fetch Progress for these students
                    const studentIds = enr.map(e => e.student_id);
                    if (studentIds.length > 0) {
                        const { data: progress } = await supabase
                            .from('user_progress')
                            .select('*')
                            .in('user_id', studentIds);

                        if (progress) {
                            const newMetrics: StudentMetrics = {};
                            studentIds.forEach(id => {
                                const studentProgress = progress.filter(p => p.user_id === id);
                                const total = studentProgress.length;
                                const correct = studentProgress.filter(p => p.is_correct).length;
                                newMetrics[id] = {
                                    totalAnswered: total,
                                    correctAnswers: correct,
                                    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0
                                };
                            });
                            setMetrics(newMetrics);
                        }
                    }
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [classId, user]);

    const handleCopyCode = () => {
        if (classDetails?.code) {
            navigator.clipboard.writeText(classDetails.code);
            alert('Class code copied to clipboard!');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!classDetails) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">Class not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[var(--bg-app)] transition-colors duration-300">
            <Navbar profile={profile} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-24">
                <div className="space-y-10">
                    <div className="space-y-10 fade-in">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 dark:bg-slate-900/50 p-8 rounded-[32px] border border-white dark:border-slate-800 backdrop-blur-xl shadow-sm">
                            <div className="flex items-center">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="mr-6 p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 shadow-sm transition-all hover:scale-110"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{classDetails.title}</h1>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 italic">
                                        {isTeacher ? 'Instructor Dashboard' : 'Student Dashboard'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {isTeacher && (
                                    <>
                                        <div className="hidden md:block px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                            <span className="text-xs font-bold text-slate-400 uppercase mr-2">Class Code:</span>
                                            <span className="font-mono font-black text-lg text-slate-900 dark:text-white tracking-widest">{classDetails.code}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowImportModal(true)}
                                                className="inline-flex items-center px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl hover:shadow-indigo-500/25 transition-all active:scale-95"
                                            >
                                                <Upload className="h-5 w-5 mr-2" />
                                                Import CSV
                                            </button>
                                            <button
                                                onClick={() => setShowInviteModal(true)}
                                                className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl shadow-xl hover:shadow-primary-500/25 transition-all active:scale-95"
                                            >
                                                <UserPlus className="h-5 w-5 mr-3" />
                                                Invite
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-2 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-2xl w-fit mx-auto md:mx-0">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                            >
                                <BarChart3 className="w-4 h-4" />
                                Analytics
                            </button>
                            <button
                                onClick={() => setActiveTab('assignments')}
                                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'assignments' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                            >
                                <ListTodo className="w-4 h-4" />
                                Assignments
                            </button>
                        </div>

                        {/* Tab Content: Analytics */}
                        {activeTab === 'analytics' && (
                            <ClassAnalytics classId={classId!} />
                        )}

                        {/* Tab Content: Overview (Roster) */}
                        {activeTab === 'overview' && (
                            <div className="bg-white dark:bg-slate-900 shadow-premium rounded-[40px] border border-white dark:border-slate-800 overflow-hidden fade-in">
                                <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Student Performance</h3>
                                        <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                                            {enrollments.length} Student{enrollments.length !== 1 ? 's' : ''} Enrolled
                                        </p>
                                    </div>
                                    <div className="hidden md:flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Questions</span>
                                        <span>Accuracy</span>
                                        <span>Performance</span>
                                    </div>
                                </div>
                                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {enrollments.map((enrollment) => {
                                        const studentId = enrollment.student_id;
                                        const stats = metrics[studentId] || { totalAnswered: 0, correctAnswers: 0, accuracy: 0 };

                                        return (
                                            <div key={enrollment.id} className="px-10 py-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group gap-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <UserAvatar
                                                            avatarUrl={enrollment.profiles?.avatar_url}
                                                            fullName={enrollment.profiles?.full_name}
                                                            email={enrollment.profiles?.email}
                                                            size="sm"
                                                            className="rounded-2xl shadow-inner group-hover:scale-105 transition-transform"
                                                        />
                                                    </div>
                                                    <div className="ml-6">
                                                        <div className="text-lg font-black text-slate-900 dark:text-white">{enrollment.profiles?.full_name || 'Anonymous Student'}</div>
                                                        <div className="text-xs font-bold text-slate-400 italic">@{enrollment.profiles?.email?.split('@')[0] || enrollment.student_id.slice(0, 8)}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between md:justify-end md:gap-14">
                                                    <div className="text-center md:w-20">
                                                        <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">{stats.totalAnswered}</div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Done</div>
                                                    </div>
                                                    <div className="text-center md:w-20">
                                                        <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">{stats.accuracy}%</div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct</div>
                                                    </div>
                                                    <div className="md:w-32 flex justify-end">
                                                        <div className={`
                                            inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                                            ${stats.totalAnswered === 0 ? 'bg-slate-50 text-slate-400 border-slate-200' :
                                                                stats.accuracy >= 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50' :
                                                                    'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/50'}
                                        `}>
                                                            {stats.totalAnswered === 0 ? 'No Activity' :
                                                                stats.accuracy >= 70 ? 'Excellent' : 'Needs Help'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {enrollments.length === 0 && (
                                        <div className="px-10 py-20 text-center">
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl mx-auto mb-6 flex items-center justify-center text-slate-300">
                                                <Users className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400 font-bold italic">No students currently enrolled.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Assignments */}
                        {(activeTab === 'assignments' || activeTab === 'overview') && (
                            <div className={`bg-white dark:bg-slate-900 shadow-premium rounded-[40px] border border-white dark:border-slate-800 overflow-hidden fade-in ${activeTab === 'overview' ? 'mt-10' : ''}`}>
                                <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Class Assignments</h3>
                                        <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                                            Manage coursework and deadlines
                                        </p>
                                    </div>
                                    {isTeacher && (
                                        <button
                                            onClick={() => setShowAssignmentModal(true)}
                                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center"
                                        >
                                            <BookOpen className="h-5 w-5 mr-2" />
                                            New Assignment
                                        </button>
                                    )}
                                </div>

                                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {assignments.map((assignment) => (
                                        <div key={assignment.id} className="p-10 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${assignment.type === 'quiz' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                        }`}>
                                                        {assignment.type}
                                                    </span>
                                                    {assignment.due_date && (
                                                        <span className="text-xs font-bold text-slate-400">
                                                            Due {new Date(assignment.due_date).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1">{assignment.title}</h4>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{assignment.description}</p>
                                            </div>
                                            <div className="mt-4 md:mt-0">
                                                {isTeacher ? (
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => setSelectedAssignment(assignment)}
                                                            className="text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                        >
                                                            View Results
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (!confirm('Are you sure you want to delete this assignment?')) return;
                                                                const { error } = await supabase.from('assignments').delete().eq('id', assignment.id);
                                                                if (!error) {
                                                                    setAssignments(assignments.filter(a => a.id !== assignment.id));
                                                                } else {
                                                                    alert('Error deleting: ' + error.message);
                                                                }
                                                            }}
                                                            className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                                            title="Delete Assignment"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-end gap-2">
                                                        {metrics[user?.id || '']?.totalAnswered > 0 && (
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded">
                                                                In Progress
                                                            </span>
                                                        )}
                                                        <button
                                                            onClick={() => navigate(assignment.type === 'quiz' ? `/quiz/q/${assignment.target_id}` : `/certification/${assignment.target_id}`)}
                                                            className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-95"
                                                        >
                                                            <PlayCircle className="h-5 w-5 mr-2" />
                                                            {metrics[user?.id || '']?.totalAnswered > 0 ? 'Continue' : 'Start'}
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Import Roster Modal */}
                                                {showImportModal && (
                                                    <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                                                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setShowImportModal(false)}></div>
                                                        <div className="flex min-h-full p-4 sm:p-12 md:p-20">
                                                            <div className="relative m-auto bg-white dark:bg-slate-900 rounded-[40px] px-8 pt-8 pb-8 text-left shadow-premium transform transition-all sm:max-w-lg sm:w-full border border-white dark:border-slate-800">
                                                                <div className="absolute top-0 right-0 pt-8 pr-8">
                                                                    <button
                                                                        type="button"
                                                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                                                        onClick={() => setShowImportModal(false)}
                                                                    >
                                                                        <span className="sr-only">Close</span>
                                                                        <span className="text-3xl font-light">&times;</span>
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Bulk Import Students</h3>
                                                                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">Upload a CSV file with an <code>email</code> column to enroll students instantly.</p>

                                                                    <RosterUploader
                                                                        classId={classId!}
                                                                        onUploadComplete={() => {
                                                                            alert('Import complete! Refreshing list...');
                                                                            window.location.reload();
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {assignments.length === 0 && (
                                        <div className="p-10 text-center text-slate-400 font-bold italic border-slate-50 dark:border-slate-800">
                                            No assignments created yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Invite Modal */}
                {showInviteModal && (
                    <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setShowInviteModal(false)}></div>
                        <div className="flex min-h-full p-4 sm:p-12 md:p-20">
                            <div className="relative m-auto bg-white dark:bg-slate-900 rounded-[40px] px-8 pt-8 pb-8 text-left shadow-premium transform transition-all sm:max-w-md sm:w-full border border-white dark:border-slate-800">
                                <div className="absolute top-0 right-0 pt-8 pr-8">
                                    <button
                                        type="button"
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                        onClick={() => setShowInviteModal(false)}
                                    >
                                        <span className="sr-only">Close</span>
                                        <span className="text-3xl font-light">&times;</span>
                                    </button>
                                </div>

                                <div className="text-center">
                                    <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-primary-100 dark:bg-primary-900/20 mb-4">
                                        <UserPlus className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight" id="modal-title">Invite Students</h3>
                                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                        Share this unique code with your students. They can enter it on their dashboard to join this class instantly.
                                    </p>

                                    <div className="mt-8 bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-center justify-between group cursor-pointer hover:border-primary-500 transition-colors" onClick={handleCopyCode}>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Code</p>
                                            <p className="text-3xl font-mono font-black text-slate-900 dark:text-white tracking-wider mt-1">{classDetails.code}</p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-400 group-hover:text-primary-600 transition-colors">
                                            <Copy className="h-6 w-6" />
                                        </div>
                                    </div>

                                    <button
                                        className="mt-8 w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl shadow-xl hover:shadow-primary-500/25 transition-all active:scale-95"
                                        onClick={() => setShowInviteModal(false)}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Assignment Modal */}
                {showAssignmentModal && (
                    <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setShowAssignmentModal(false)}></div>
                        <div className="flex min-h-full p-4 sm:p-12 md:p-20">
                            <div className="relative m-auto bg-white dark:bg-slate-900 rounded-[40px] px-8 pt-8 pb-8 text-left shadow-premium transform transition-all sm:max-w-lg sm:w-full border border-white dark:border-slate-800">
                                <div className="absolute top-0 right-0 pt-8 pr-8">
                                    <button
                                        type="button"
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                        onClick={() => setShowAssignmentModal(false)}
                                    >
                                        <span className="sr-only">Close</span>
                                        <span className="text-3xl font-light">&times;</span>
                                    </button>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-6">New Assignment</h3>

                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        if (!classId) return;

                                        const { error } = await supabase
                                            .from('assignments')
                                            .insert({
                                                class_id: classId,
                                                title: newAssignment.title,
                                                description: newAssignment.description,
                                                type: newAssignment.type,
                                                target_id: newAssignment.target_id,
                                                due_date: newAssignment.due_date || null
                                            });

                                        if (error) {
                                            alert('Error creating assignment: ' + error.message);
                                        } else {
                                            // Refresh assignments
                                            const { data: asm } = await supabase
                                                .from('assignments')
                                                .select('*')
                                                .eq('class_id', classId)
                                                .order('created_at', { ascending: false });
                                            if (asm) setAssignments(asm);

                                            setShowAssignmentModal(false);
                                            setNewAssignment({
                                                title: '',
                                                description: '',
                                                type: 'quiz',
                                                target_id: '',
                                                due_date: ''
                                            });
                                        }
                                    }} className="space-y-4">

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Assignment Title</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-none focus:ring-2 focus:ring-indigo-500"
                                                value={newAssignment.title}
                                                onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                                placeholder="e.g., Week 1 Quiz"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                                            <textarea
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-none focus:ring-2 focus:ring-indigo-500"
                                                value={newAssignment.description}
                                                onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                                placeholder="Instructions for students..."
                                                rows={2}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Type</label>
                                                <select
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-none focus:ring-2 focus:ring-indigo-500"
                                                    value={newAssignment.type}
                                                    onChange={e => setNewAssignment({ ...newAssignment, type: e.target.value })}
                                                >
                                                    <option value="quiz">Quiz</option>
                                                    <option value="certification">Certification Practice</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Due Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-none focus:ring-2 focus:ring-indigo-500"
                                                    value={newAssignment.due_date}
                                                    onChange={e => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Content</label>
                                            <select
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border-none focus:ring-2 focus:ring-indigo-500"
                                                value={newAssignment.target_id}
                                                onChange={e => setNewAssignment({ ...newAssignment, target_id: e.target.value })}
                                            >
                                                <option value="">Select a {newAssignment.type === 'quiz' ? 'Quiz' : 'Certification'}...</option>
                                                {availableQuizzes
                                                    .filter(q => q.type === newAssignment.type)
                                                    .map(q => (
                                                        <option key={q.id} value={q.id}>{q.title} ({q.provider})</option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl hover:shadow-indigo-500/25 transition-all active:scale-95"
                                        >
                                            Create Assignment
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Assignment Results Modal */}
                {selectedAssignment && (
                    <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setSelectedAssignment(null)}></div>
                        <div className="flex min-h-full p-4 sm:p-12 md:p-20">
                            <div className="relative m-auto bg-white dark:bg-slate-900 rounded-[40px] px-8 pt-8 pb-8 text-left shadow-premium transform transition-all sm:max-w-3xl sm:w-full border border-white dark:border-slate-800">
                                <div className="absolute top-0 right-0 pt-8 pr-8">
                                    <button
                                        type="button"
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                                        onClick={() => setSelectedAssignment(null)}
                                    >
                                        <span className="sr-only">Close</span>
                                        <span className="text-3xl font-light">&times;</span>
                                    </button>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Assignment Results</h3>
                                    <p className="text-slate-500 font-bold mb-8">{selectedAssignment.title}</p>

                                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                        <AssignmentResultsList
                                            assignment={selectedAssignment}
                                            enrollments={enrollments}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}

// Sub-component to fetch and display results
function AssignmentResultsList({ assignment, enrollments }: { assignment: any, enrollments: Enrollment[] }) {
    const [submissions, setSubmissions] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSubmissions() {
            if (assignment.type !== 'quiz') {
                setLoading(false);
                return;
            }

            const { data } = await supabase
                .from('quiz_submissions')
                .select('user_id, score, total_questions')
                .eq('quiz_id', assignment.target_id);

            if (data) {
                const subMap: Record<string, number> = {};
                data.forEach(sub => {
                    // Calculate percentage
                    const pct = sub.total_questions > 0
                        ? Math.round((sub.score / sub.total_questions) * 100)
                        : 0;

                    // Keep highest score if multiple attempts (optional logic)
                    if (!subMap[sub.user_id] || pct > subMap[sub.user_id]) {
                        subMap[sub.user_id] = pct;
                    }
                });
                setSubmissions(subMap);
            }
            setLoading(false);
        }
        fetchSubmissions();
    }, [assignment]);

    if (loading) return <div className="text-center py-4">Loading results...</div>;

    return (
        <>
            {enrollments.map((enrollment) => {
                const score = submissions[enrollment.student_id];
                const hasScore = score !== undefined;

                return (
                    <div key={enrollment.student_id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                            <UserAvatar
                                avatarUrl={enrollment.profiles?.avatar_url}
                                fullName={enrollment.profiles?.full_name}
                                email={enrollment.profiles?.email}
                                size="sm"
                            />
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">{enrollment.profiles?.full_name}</p>
                                <p className="text-xs text-slate-500">@{enrollment.profiles?.email?.split('@')[0]}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</p>
                                <p className={`font-bold ${hasScore ? 'text-emerald-500' : 'text-slate-400'}`}>
                                    {hasScore ? 'Completed' : 'Pending'}
                                </p>
                            </div>
                            <div className="text-right w-20">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Score</p>
                                <p className="font-mono font-black text-xl text-slate-900 dark:text-white">
                                    {hasScore ? `${score}%` : '--'}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
            {enrollments.length === 0 && (
                <div className="text-center py-10 text-slate-400 italic">No students in this class.</div>
            )}
        </>
    );
}
