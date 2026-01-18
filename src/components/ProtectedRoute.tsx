import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    console.log('ProtectedRoute: State check:', { hasUser: !!user, loading });

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        console.warn('ProtectedRoute: No user found, redirecting to /login');
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}
