import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { User, Edit2, Save, Award, Trophy, Share2, Check, X, Camera, BookOpen, Briefcase, Users, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import BadgeShelf from '../components/gamification/BadgeShelf';
import UserAvatar from '../components/common/UserAvatar';
import type { Database } from '../types/supabase';
import { LevelService } from '../lib/LevelService';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function ProfilePage() {
    const { userId } = useParams<{ userId?: string }>(); // Optional param
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showShareTooltip, setShowShareTooltip] = useState(false);
    const [editForm, setEditForm] = useState({
        full_name: '',
        bio: '',
        is_public: true
    });
    // Password change state
    const [passwordForm, setPasswordForm] = useState({
        new_password: '',
        confirm_password: ''
    });
    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    // Teacher specific state
    const [teacherClasses, setTeacherClasses] = useState<any[]>([]);

    const isOwnProfile = !userId || (user && user.id === userId);
    const targetId = userId || user?.id;

    useEffect(() => {
        async function fetchProfile() {
            if (!targetId) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', targetId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            }

            if (data) {
                setProfile(data);
                setEditForm({
                    full_name: data.full_name || '',
                    bio: data.bio || '',
                    is_public: data.is_public ?? true
                });

                // Fetch classes if teacher
                if (data.role === 'teacher') {
                    const { data: classes } = await supabase
                        .from('classes')
                        .select('id, title, code, class_enrollments(count)')
                        .eq('teacher_id', targetId);

                    if (classes) {
                        const formatted = classes.map((c: any) => ({
                            ...c,
                            student_count: c.class_enrollments?.[0]?.count || 0
                        }));
                        setTeacherClasses(formatted);
                    }
                }
            }
            setLoading(false);
        }
        fetchProfile();
    }, [targetId]);

    const handleSave = async () => {
        if (!user) return;

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: editForm.full_name,
                bio: editForm.bio,
                is_public: editForm.is_public
            })
            .eq('id', user.id);

        if (!error) {
            setProfile(prev => prev ? { ...prev, ...editForm } : null);
            setIsEditing(false);
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }
        if (passwordForm.new_password.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage(null);

        const { error } = await supabase.auth.updateUser({
            password: passwordForm.new_password
        });

        if (error) {
            setPasswordMessage({ type: 'error', text: error.message });
        } else {
            setPasswordMessage({ type: 'success', text: 'Password updated successfully.' });
            setPasswordForm({ new_password: '', confirm_password: '' });
        }
        setPasswordLoading(false);
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-slate-400 font-medium">Synchronizing profile data...</div>;

    if (!profile) {
        if (isOwnProfile) {
            return (
                <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-[40px] shadow-premium text-center max-w-md w-full border border-slate-100 dark:border-slate-800">
                        <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-10 h-10 text-rose-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Dossier Missing</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Your operative dossier was not initialized correctly. This can happen if the sync trigger was interrupted.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl shadow-xl transition-all"
                        >
                            Retry Sync
                        </button>
                    </div>
                </div>
            );
        }
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 p-12 rounded-[40px] shadow-premium text-center max-w-md w-full border border-slate-100 dark:border-slate-800">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Restricted Access</h2>
                    <p className="text-slate-500 dark:text-slate-400">This operative's dossier is classified.</p>
                </div>
            </div>
        );
    }

    if (!isOwnProfile && !profile.is_public && profile.role !== 'teacher') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 p-12 rounded-[40px] shadow-premium text-center max-w-md w-full border border-slate-100 dark:border-slate-800">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Restricted Access</h2>
                    <p className="text-slate-500 dark:text-slate-400">This operative's dossier is classified.</p>
                </div>
            </div>
        );
    }

    const isTeacher = profile.role === 'teacher';
    const currentLevel = LevelService.getLevel(profile.points || 0);
    const progress = LevelService.getProgress(profile.points || 0);
    const nextLevelXP = LevelService.getXPForNextLevel(currentLevel);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 pb-20 fade-in">
            <div className="max-w-5xl mx-auto pt-24 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-premium overflow-hidden border border-white dark:border-slate-800 transition-all hover:shadow-2xl relative group">
                    {/* Cover Gradient */}
                    <div className={`h-64 relative overflow-hidden ${isTeacher
                        ? 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800'
                        : 'bg-gradient-to-br from-indigo-600 via-primary-600 to-violet-700'
                        }`}>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    <div className="px-8 md:px-12 pb-12 relative">
                        <div className="flex flex-col md:flex-row justify-between items-end -mt-20 gap-6">

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[36px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <UserAvatar
                                    avatarUrl={profile.avatar_url}
                                    fullName={profile.full_name}
                                    email={user?.email}
                                    size="xl"
                                    className="relative rounded-[32px] border-4 border-white dark:border-slate-900 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
                                />
                                {isOwnProfile && (
                                    <button className="absolute bottom-2 right-2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 text-primary-600 dark:text-primary-400 hover:scale-110 active:scale-95 transition-all">
                                        <Camera className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 mb-2 text-center md:text-left w-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        {isEditing ? (
                                            <div className="mb-2">
                                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Codename</label>
                                                <input
                                                    type="text"
                                                    className="text-3xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-b-2 border-primary-500 focus:outline-none px-2 py-1 rounded-t-lg w-full md:w-auto"
                                                    value={editForm.full_name}
                                                    onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                                                    autoFocus
                                                />
                                            </div>
                                        ) : (
                                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
                                                {profile.full_name || 'Anonymous User'}
                                            </h1>
                                        )}
                                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium pb-2 md:pb-0">
                                            {isTeacher ? (
                                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                                                    <Briefcase className="w-3 h-3" />
                                                    Instructor
                                                </span>
                                            ) : (
                                                <>
                                                    <span>Level {currentLevel} Operative</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                                    <span className="text-primary-600 dark:text-primary-400 font-bold">Field Agent</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-3">
                                        <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold tracking-wide border border-slate-200 dark:border-slate-700">
                                            @{profile.username || 'operative'}
                                        </span>
                                        <span className="px-3 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-widest border border-primary-100 dark:border-primary-800">
                                            {profile.role || 'Scholar'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <button
                                            onClick={handleShare}
                                            className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-primary-500 hover:border-primary-200 dark:hover:border-primary-900 transition-all shadow-sm hover:shadow-md"
                                            title="Copy Public Link"
                                        >
                                            {showShareTooltip ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
                                        </button>
                                        {showShareTooltip && (
                                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-lg shadow-xl whitespace-nowrap animate-bounce">
                                                Copied!
                                            </div>
                                        )}
                                    </div>

                                    {isOwnProfile && (
                                        isEditing ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl font-bold hover:bg-rose-100 transition-all"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    className="flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all"
                                                >
                                                    <Save className="w-4 h-4 mr-2" /> Save
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-black rounded-xl shadow-lg transition-all"
                                            >
                                                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Level Progress Bar (Student Only) */}
                {!isTeacher && (
                    <div className="mt-12 bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Current Progress</span>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    <span className="text-primary-600 dark:text-primary-400">{Math.floor(profile.points || 0)}</span>
                                    <span className="mx-1 text-slate-300">/</span>
                                    {nextLevelXP} XP
                                </span>
                            </div>
                            <span className="text-xs font-black text-primary-500 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-lg">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary-500 to-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-bar-stripes_1s_linear_infinite]"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats, Bio & Security */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {isTeacher ? (
                                // Teacher Stats
                                [
                                    { label: 'Classes', value: teacherClasses.length, icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/10' },
                                    { label: 'Students', value: teacherClasses.reduce((acc, c) => acc + c.student_count, 0), icon: Users, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/10' },
                                ].map((stat) => (
                                    <div key={stat.label} className="p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                                        <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">{stat.label}</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</p>
                                    </div>
                                ))
                            ) : (
                                // Student Stats
                                [
                                    { label: 'Total XP', value: (profile.points || 0).toLocaleString(), icon: Award, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' },
                                    { label: 'Streak', value: `${profile.current_streak || 0} Days`, icon: Trophy, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/10' },
                                ].map((stat) => (
                                    <div key={stat.label} className="p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                                        <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">{stat.label}</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Bio Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                Operative Bio
                            </h3>
                            {isEditing ? (
                                <div className="space-y-4">
                                    <textarea
                                        className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:border-primary-500 outline-none font-medium transition-all resize-none"
                                        rows={6}
                                        placeholder="Enter your biography..."
                                        value={editForm.bio}
                                        onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                    />
                                    <label className="flex items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-primary-200 transition-all">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={editForm.is_public}
                                                onChange={e => setEditForm({ ...editForm, is_public: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                        </div>
                                        <span className="ml-3 text-sm font-bold text-slate-700 dark:text-slate-300">Public Visibility</span>
                                    </label>
                                </div>
                            ) : (
                                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                                    "{profile.bio || "No dossier info available."}"
                                </p>
                            )}
                        </div>

                        {/* Security Card */}
                        {isOwnProfile && (
                            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                                    <Shield className="w-4 h-4 mr-2" />
                                    Security Settings
                                </h3>

                                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type={showPasswords ? "text" : "password"}
                                                placeholder="New Password"
                                                className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:border-primary-500 outline-none font-medium transition-all"
                                                value={passwordForm.new_password}
                                                onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(!showPasswords)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                            >
                                                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type={showPasswords ? "text" : "password"}
                                                placeholder="Confirm New Password"
                                                className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:border-primary-500 outline-none font-medium transition-all"
                                                value={passwordForm.confirm_password}
                                                onChange={e => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {passwordMessage && (
                                        <div className={`p-4 rounded-xl text-sm font-bold ${passwordMessage.type === 'success'
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400'
                                            }`}>
                                            {passwordMessage.text}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={passwordLoading}
                                        className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {passwordLoading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Badges (Full Width) */}
                    <div className="lg:col-span-2">
                        {isTeacher ? (
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Active Classes</h3>
                                    <div className="h-0.5 flex-1 mx-6 bg-slate-100 dark:bg-slate-800"></div>
                                    <BookOpen className="w-6 h-6 text-indigo-500" />
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {teacherClasses.map((cls) => (
                                        <div key={cls.id} className="p-5 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex justify-between items-center group hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors">
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">{cls.title}</h4>
                                                <div className="flex items-center mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                                                    <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 mr-2 font-mono">{cls.code}</span>
                                                    <Users className="w-3 h-3 mr-1" />
                                                    {cls.student_count} Students
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {teacherClasses.length === 0 && (
                                        <div className="text-center py-12 text-slate-400 italic">No classes found.</div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Hall of Fame</h3>
                                    <div className="h-0.5 flex-1 mx-6 bg-slate-100 dark:bg-slate-800"></div>
                                    <Trophy className="w-6 h-6 text-amber-500" />
                                </div>
                                <BadgeShelf userId={profile.id} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
