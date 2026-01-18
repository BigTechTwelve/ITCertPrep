import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PathwayManager from '../admin/PathwayManager';
import CertificationManager from '../admin/CertificationManager';
import ObjectiveManager from '../admin/ObjectiveManager';
import QuestionManager from '../admin/QuestionManager';
import UserManager from '../admin/UserManager';
import ClassManager from '../admin/ClassManager';
import OrganizationManager from '../admin/OrganizationManager';
import type { Database } from '../../types/supabase';
import { Users, Box, Award, Target, BookOpen, Activity, ArrowRight, ShieldCheck, UserCog, BarChart3, TrendingUp, Settings, Sparkles, School } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

type Certification = Database['public']['Tables']['certifications']['Row'];
type Objective = Database['public']['Tables']['objectives']['Row'];

interface AnalyticsData {
    date: string;
    new_users: number;
    quizzes_completed: number;
}

export default function AdminDashboard() {
    const [activeView, setActiveView] = useState<'overview' | 'pathways' | 'certifications' | 'objectives' | 'questions' | 'users' | 'classes' | 'organizations' | 'settings'>('overview');
    const { settings, loading: settingsLoading, refresh: refreshSettings } = useSettings();
    const [updating, setUpdating] = useState(false);
    const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
    const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
    const [stats, setStats] = useState({
        users: 0,
        classes: 0,
        certifications: 0
    });
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch Stats
                const [
                    { count: usersCount },
                    { count: classesCount },
                    { count: certsCount }
                ] = await Promise.all([
                    supabase.from('profiles').select('*', { count: 'exact', head: true }),
                    supabase.from('classes').select('*', { count: 'exact', head: true }),
                    supabase.from('certifications').select('*', { count: 'exact', head: true })
                ]);

                setStats({
                    users: usersCount || 0,
                    classes: classesCount || 0,
                    certifications: certsCount || 0
                });

                // Fetch Analytics RPC
                const { data, error } = await supabase.rpc('get_global_analytics');
                if (error) {
                    console.error('Analytics Fetch Error:', error);
                    // Fallback mock data if RPC fails or missing
                    setAnalyticsData([]);
                } else if (data) {
                    setAnalyticsData(data as AnalyticsData[]);
                }

            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (activeView === 'users') {
        return <UserManager onBack={() => setActiveView('overview')} />;
    }

    if (activeView === 'classes') {
        return <ClassManager onBack={() => setActiveView('overview')} />;
    }

    if (activeView === 'organizations') {
        return <OrganizationManager onBack={() => setActiveView('overview')} />;
    }

    if (activeView === 'pathways') {
        return <PathwayManager onBack={() => setActiveView('overview')} />;
    }

    if (activeView === 'certifications') {
        return (
            <CertificationManager
                onBack={() => setActiveView('overview')}
                onManageObjectives={(cert) => {
                    setSelectedCert(cert);
                    setActiveView('objectives');
                }}
            />
        );
    }

    if (activeView === 'objectives' && selectedCert) {
        return (
            <ObjectiveManager
                certification={selectedCert}
                onBack={() => {
                    setSelectedCert(null);
                    setActiveView('certifications');
                }}
                onManageQuestions={(obj) => {
                    setSelectedObjective(obj);
                    setActiveView('questions');
                }}
            />
        );
    }

    if (activeView === 'questions' && selectedObjective) {
        return (
            <QuestionManager
                objective={selectedObjective}
                onBack={() => {
                    setSelectedObjective(null);
                    setActiveView('objectives');
                }}
            />
        );
    }

    if (activeView === 'settings') {
        return (
            <div className="space-y-10 fade-in">
                <div className="flex items-center gap-4">
                    <button onClick={() => setActiveView('overview')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        <ArrowRight className="w-6 h-6 rotate-180" />
                    </button>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Settings</h1>
                </div>

                <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-premium border border-white dark:border-slate-800">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">AI Functionality</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Enable or disable all Gemini AI features</p>
                                </div>
                            </div>
                            {settingsLoading ? (
                                <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-full" />
                            ) : (
                                <button
                                    disabled={updating}
                                    onClick={async () => {
                                        setUpdating(true);
                                        const { error } = await supabase
                                            .from('site_settings')
                                            .update({ value: !settings.ai_enabled })
                                            .eq('key', 'ai_enabled');
                                        if (error) {
                                            alert(error.message);
                                        } else {
                                            await refreshSettings();
                                        }
                                        setUpdating(false);
                                    }}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${settings.ai_enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${settings.ai_enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Prepare max for scaling
    // Add check for empty analytics data to prevent -Infinity
    const maxUsers = analyticsData.length > 0 ? Math.max(...analyticsData.map(d => d.new_users), 1) : 10;
    const maxQuizzes = analyticsData.length > 0 ? Math.max(...analyticsData.map(d => d.quizzes_completed), 1) : 10;

    return (
        <div className="space-y-10 fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                        Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Hub</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">System Overview & Content Management</p>
                </div>
                <div className="hidden md:block">
                    <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full border border-indigo-100 dark:border-indigo-900/50 flex items-center">
                        <ShieldCheck className="w-4 h-4 text-indigo-600 mr-2" />
                        <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-widest">Admin Access Granted</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => setActiveView('users')}
                    className="group relative bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-premium border border-white dark:border-slate-800 overflow-hidden hover:scale-[1.02] transition-transform duration-300 text-left"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 text-indigo-600" />
                    </div>
                    <dt className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Total Users</dt>
                    <dd className="text-5xl font-black text-slate-900 dark:text-white mb-4">{stats.users}</dd>
                    <div className="flex items-center text-emerald-500 font-bold text-sm">
                        <Activity className="w-4 h-4 mr-1" />
                        <span>Manage Users &rarr;</span>
                    </div>
                </button>

                <button
                    onClick={() => setActiveView('certifications')}
                    className="group relative bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-premium border border-white dark:border-slate-800 overflow-hidden hover:scale-[1.02] transition-transform duration-300 text-left"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Award className="w-24 h-24 text-violet-600" />
                    </div>
                    <dt className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Certifications</dt>
                    <dd className="text-5xl font-black text-slate-900 dark:text-white mb-4">{stats.certifications}</dd>
                    <div className="flex items-center text-violet-500 font-bold text-sm">
                        <BookOpen className="w-4 h-4 mr-1" />
                        <span>Manage Content &rarr;</span>
                    </div>
                </button>

                <button
                    onClick={() => setActiveView('classes')}
                    className="group relative bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-premium border border-white dark:border-slate-800 overflow-hidden hover:scale-[1.02] transition-transform duration-300 text-left"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Box className="w-24 h-24 text-emerald-600" />
                    </div>
                    <dt className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Active Classes</dt>
                    <dd className="text-5xl font-black text-slate-900 dark:text-white mb-4">{stats.classes}</dd>
                    <div className="flex items-center text-slate-400 font-bold text-sm group-hover:text-emerald-500 transition-colors">
                        <span>View Classes &rarr;</span>
                    </div>
                </button>
            </div>

            {/* Analytics Charts */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-premium border border-white dark:border-slate-800">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            <BarChart3 className="h-6 w-6 text-indigo-500" />
                            Activity Trends
                        </h2>
                        <p className="text-slate-500 font-medium">Last 7 Days Performance</p>
                    </div>
                    {analyticsData.length > 0 && (
                        <div className="px-4 py-1 bg-slate-50 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Values from {analyticsData[0]?.date} to {analyticsData[analyticsData.length - 1]?.date}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* New Users Chart */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" /> New Users
                        </h3>
                        <div className="flex items-end h-40 gap-2">
                            {analyticsData.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center group">
                                    <div
                                        className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-lg opacity-80 group-hover:opacity-100 transition-all relative"
                                        style={{ height: `${Math.max((d.new_users / maxUsers) * 100, 5)}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            {d.new_users}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium mt-2">{d.date.slice(5)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quizzes Completed Chart */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Target className="h-4 w-4" /> Quizzes Completed
                        </h3>
                        <div className="flex items-end h-40 gap-2">
                            {analyticsData.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center group">
                                    <div
                                        className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg opacity-80 group-hover:opacity-100 transition-all relative"
                                        style={{ height: `${Math.max((d.quizzes_completed / maxQuizzes) * 100, 5)}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            {d.quizzes_completed}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium mt-2">{d.date.slice(5)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Management Grid */}
            <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Management Console</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* User Management */}
                    <button
                        onClick={() => setActiveView('users')}
                        className="group flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-[24px] shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-1"
                    >
                        <div className="flex items-center">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 mr-6">
                                <UserCog className="h-7 w-7" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">User Management</h3>
                                <p className="text-slate-500 font-medium">Manage permissions</p>
                            </div>
                        </div>
                    </button>

                    {/* Organization Management */}
                    <button
                        onClick={() => setActiveView('organizations')}
                        className="group flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-[24px] shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-1"
                    >
                        <div className="flex items-center">
                            <div className="h-14 w-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 mr-6">
                                <School className="h-7 w-7" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Organizations</h3>
                                <p className="text-slate-500 font-medium">Verify schools</p>
                            </div>
                        </div>
                    </button>

                    {/* Pathways */}
                    <button
                        onClick={() => setActiveView('pathways')}
                        className="group flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-[24px] shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-1"
                    >
                        <div className="flex items-center">
                            <div className="h-14 w-14 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-violet-600 mr-6">
                                <Target className="h-7 w-7" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Career Pathways</h3>
                                <p className="text-slate-500 font-medium">Cluster Management</p>
                            </div>
                        </div>
                    </button>

                    {/* Certifications */}
                    <button
                        onClick={() => setActiveView('certifications')}
                        className="group flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-[24px] shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-1"
                    >
                        <div className="flex items-center">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mr-6">
                                <Award className="h-7 w-7" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Certifications</h3>
                                <p className="text-slate-500 font-medium">Content & Exams</p>
                            </div>
                        </div>
                    </button>

                    {/* System Settings */}
                    <button
                        onClick={() => setActiveView('settings')}
                        className="group flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-[24px] shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-1"
                    >
                        <div className="flex items-center">
                            <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 mr-6">
                                <Settings className="h-7 w-7" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">System Settings</h3>
                                <p className="text-slate-500 font-medium">Global Config</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
            {/* Added extra div to close returning logic just in case, but structure seems solid now */}
        </div>
    );
}
