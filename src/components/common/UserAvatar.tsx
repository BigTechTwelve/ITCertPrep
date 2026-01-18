import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { getInitials, filterPlaceholderUrl } from '../../lib/UserUtils';

interface UserAvatarProps {
    avatarUrl?: string | null;
    fullName?: string | null;
    email?: string | null;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-20 h-20 text-2xl',
};

export default function UserAvatar({ avatarUrl, fullName, email, size = 'sm', className = '' }: UserAvatarProps) {
    const [imgError, setImgError] = useState(false);
    const [validUrl, setValidUrl] = useState<string | null>(null);

    useEffect(() => {
        setValidUrl(filterPlaceholderUrl(avatarUrl));
        setImgError(false);
    }, [avatarUrl]);

    const initials = getInitials(fullName, email);

    if (validUrl && !imgError) {
        return (
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
                <img
                    src={validUrl}
                    alt={fullName || 'User'}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                />
            </div>
        );
    }

    return (
        <div className={`
            ${sizeClasses[size]} rounded-full flex-shrink-0 flex items-center justify-center 
            bg-gradient-to-tr from-primary-500 to-indigo-600 
            text-white font-black shadow-md border border-white/20
            ${className}
        `}>
            {initials !== '?' ? (
                <span>{initials}</span>
            ) : (
                <User className={size === 'xs' || size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} />
            )}
        </div>
    );
}
