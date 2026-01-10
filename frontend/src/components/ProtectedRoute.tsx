import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType: 'teacher' | 'student';
}

export default function ProtectedRoute({ children, userType }: ProtectedRouteProps) {
  const { isAuthenticated, user, token } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // localStorage에서 직접 인증 정보 확인
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    // localStorage에 정보가 있으면 인증된 것으로 간주
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // 사용자 타입 확인
        if (parsedUser.type === userType) {
          setIsChecking(false);
          return;
        }
      } catch (e) {
        console.error('사용자 정보 파싱 실패:', e);
      }
    }
    
    setIsChecking(false);
  }, [userType]);

  // 인증 확인 중일 때는 로딩 표시
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  // localStorage에서 직접 확인
  const savedToken = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');

  if (!savedToken || !savedUser) {
    console.log('ProtectedRoute: localStorage에 인증 정보 없음');
    return <Navigate to={userType === 'teacher' ? '/teacher/login' : '/student/login'} replace />;
  }

  try {
    const parsedUser = JSON.parse(savedUser);
    
    // 사용자 타입 확인
    if (parsedUser.type !== userType) {
      console.log('ProtectedRoute: 사용자 타입 불일치', { userType: parsedUser.type, required: userType });
      return <Navigate to={userType === 'teacher' ? '/teacher/login' : '/student/login'} replace />;
    }

    // 인증 정보가 있으면 대시보드 표시
    return <>{children}</>;
  } catch (e) {
    console.error('사용자 정보 파싱 실패:', e);
    return <Navigate to={userType === 'teacher' ? '/teacher/login' : '/student/login'} replace />;
  }
}

