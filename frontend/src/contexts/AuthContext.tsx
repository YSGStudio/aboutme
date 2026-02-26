import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

// 환경 변수에서 API URL 가져오기 (배포 시 설정)
const API_URL = import.meta.env.VITE_API_URL || '/api';

// 디버깅: API URL 확인
console.log('API_URL:', API_URL);
console.log('VITE_API_URL env:', import.meta.env.VITE_API_URL);

interface User {
  id: number;
  email?: string;
  name?: string;
  classCode?: string;
  classNumber?: number;
  type: 'teacher' | 'student';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // axios 인터셉터 추가 - 에러 로깅
  axios.interceptors.request.use(
    (config) => {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error('API Response Error:', error.response?.status, error.response?.data);
      console.error('Request URL:', error.config?.url);
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionToken = data.session?.access_token || null;
      const storedUser = localStorage.getItem('user');

      if (!isMounted) return;
      if (sessionToken && storedUser) {
        setToken(sessionToken);
        setUser(JSON.parse(storedUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionToken = session?.access_token || null;
      if (sessionToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
      setToken(sessionToken);
    });

    syncSession();

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    // 상태 업데이트를 동기적으로 처리
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { API_URL };

