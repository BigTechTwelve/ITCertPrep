export const getInitials = (fullName?: string | null, email?: string | null): string => {
    if (fullName) {
        const parts = fullName.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    }
    if (email) {
        return email[0].toUpperCase();
    }
    return '?';
};

export const filterPlaceholderUrl = (url?: string | null): string | null => {
    if (!url) return null;
    if (url.includes('via.placeholder.com')) return null;
    return url;
};
