export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    username: string | null
                    avatar_url: string | null
                    role: 'admin' | 'teacher' | 'student'
                    school_id: string | null
                    points: number
                    study_time_seconds: number
                    bio: string | null
                    is_public: boolean
                    current_streak: number
                    longest_streak: number
                    last_login_date: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    username?: string | null
                    avatar_url?: string | null
                    role?: 'admin' | 'teacher' | 'student'
                    school_id?: string | null
                    points?: number
                    study_time_seconds?: number
                    bio?: string | null
                    is_public?: boolean
                    current_streak?: number
                    longest_streak?: number
                    last_login_date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    username?: string | null
                    avatar_url?: string | null
                    role?: 'admin' | 'teacher' | 'student'
                    school_id?: string | null
                    points?: number
                    study_time_seconds?: number
                    bio?: string | null
                    is_public?: boolean
                    current_streak?: number
                    longest_streak?: number
                    last_login_date?: string | null
                    created_at?: string
                }
            }
            pathways: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    created_at?: string
                }
            }
            classes: {
                Row: {
                    id: string
                    title: string
                    pathway_id: string
                    teacher_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    pathway_id: string
                    teacher_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    pathway_id?: string
                    teacher_id?: string | null
                    created_at?: string
                }
            }
            class_enrollments: {
                Row: {
                    id: string
                    class_id: string
                    student_id: string
                    enrolled_at: string
                }
                Insert: {
                    id?: string
                    class_id: string
                    student_id: string
                    enrolled_at?: string
                }
                Update: {
                    id?: string
                    class_id?: string
                    student_id?: string
                    enrolled_at?: string
                }
            }
            certifications: {
                Row: {
                    id: string
                    title: string
                    provider: string
                    class_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    provider: string
                    class_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    provider?: string
                    class_id?: string | null
                    created_at?: string
                }
            }
            objectives: {
                Row: {
                    id: string
                    title: string
                    certification_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    certification_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    certification_id?: string
                    created_at?: string
                }
            }
            questions: {
                Row: {
                    id: string
                    objective_id: string
                    text: string
                    type: 'multiple_choice' | 'true_false' | 'short_answer'
                    points: number
                    explanation: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    objective_id: string
                    text: string
                    type?: 'multiple_choice' | 'true_false' | 'short_answer'
                    points?: number
                    explanation?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    objective_id?: string
                    text?: string
                    type?: 'multiple_choice' | 'true_false' | 'short_answer'
                    points?: number
                    explanation?: string | null
                    created_at?: string
                }
            }
            answers: {
                Row: {
                    id: string
                    question_id: string
                    text: string
                    is_correct: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    question_id: string
                    text: string
                    is_correct?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    question_id?: string
                    text?: string
                    is_correct?: boolean
                    created_at?: string
                }
            }
            guilds: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    avatar_url: string | null
                    leader_id: string
                    is_private: boolean
                    join_code: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    avatar_url?: string | null
                    leader_id: string
                    is_private?: boolean
                    join_code?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    avatar_url?: string | null
                    leader_id?: string
                    is_private?: boolean
                    join_code?: string | null
                    created_at?: string
                }
            }
            guild_members: {
                Row: {
                    id: string
                    guild_id: string
                    user_id: string
                    role: 'leader' | 'admin' | 'member'
                    joined_at: string
                }
                Insert: {
                    id?: string
                    guild_id: string
                    user_id: string
                    role?: 'leader' | 'admin' | 'member'
                    joined_at?: string
                }
                Update: {
                    id?: string
                    guild_id?: string
                    user_id?: string
                    role?: 'leader' | 'admin' | 'member'
                    joined_at?: string
                }
            }
            flashcards: {
                Row: {
                    id: string
                    user_id: string
                    question_id: string | null
                    front: string
                    back: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    question_id?: string | null
                    front: string
                    back: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    question_id?: string | null
                    front?: string
                    back?: string
                    created_at?: string
                }
            }
            flashcard_reviews: {
                Row: {
                    id: string
                    user_id: string
                    flashcard_id: string
                    next_review_at: string
                    interval: number
                    repetition: number
                    ef_factor: number
                    last_reviewed_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    flashcard_id: string
                    next_review_at: string
                    interval?: number
                    repetition?: number
                    ef_factor?: number
                    last_reviewed_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    flashcard_id?: string
                    next_review_at?: string
                    interval?: number
                    repetition?: number
                    ef_factor?: number
                    last_reviewed_at?: string
                }
            }
        }
    }
}
