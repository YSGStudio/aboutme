import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType: 'teacher' | 'student';
}

export default function ProtectedRoute({ children, userType }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={userType === 'teacher' ? '/teacher/login' : '/student/login'} replace />;
  }

  if (user?.type !== userType) {
    return <Navigate to={userType === 'teacher' ? '/teacher/login' : '/student/login'} replace />;
  }

  return <>{children}</>;
}

