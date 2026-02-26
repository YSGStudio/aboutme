import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function TeacherLogin() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { type: 'teacher', classCode }
          }
        });
        if (error) throw error;

        const authUserId = data.user?.id;
        if (!authUserId) throw new Error('회원가입에 실패했습니다.');

        const { data: existing } = await supabase
          .from('teachers')
          .select('id, class_code, email')
          .eq('auth_user_id', authUserId)
          .maybeSingle();

        if (!existing) {
          const { data: created, error: createError } = await supabase
            .from('teachers')
            .insert({
              auth_user_id: authUserId,
              email,
              password: '',
              class_code: classCode
            })
            .select('id, class_code, email')
            .single();
          if (createError) throw createError;

          const sessionToken = data.session?.access_token;
          if (!sessionToken) {
            setError('이메일 인증 후 로그인해주세요.');
            return;
          }
          login(sessionToken, {
            id: created.id,
            email: created.email,
            classCode: created.class_code,
            type: 'teacher'
          });
        } else {
          const sessionToken = data.session?.access_token;
          if (!sessionToken) {
            setError('이메일 인증 후 로그인해주세요.');
            return;
          }
          login(sessionToken, {
            id: existing.id,
            email: existing.email,
            classCode: existing.class_code,
            type: 'teacher'
          });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;

        const authUserId = data.user?.id;
        if (!authUserId) throw new Error('로그인에 실패했습니다.');

        const { data: teacher, error: fetchError } = await supabase
          .from('teachers')
          .select('id, class_code, email')
          .eq('auth_user_id', authUserId)
          .single();
        if (fetchError) throw fetchError;

        const sessionToken = data.session?.access_token;
        if (sessionToken) {
          login(sessionToken, {
            id: teacher.id,
            email: teacher.email,
            classCode: teacher.class_code,
            type: 'teacher'
          });
        }
      }

      // localStorage에 저장된 후 네비게이션
      // window.location을 사용하여 강제 리다이렉트 (상태 업데이트 문제 방지)
      setTimeout(() => {
        window.location.href = '/teacher/dashboard';
      }, 100);
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* 홈 버튼 */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center group"
        aria-label="홈으로 이동"
      >
        <svg className="w-6 h-6 text-purple-600 group-hover:text-purple-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>

      <div className="card w-full max-w-md p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            교사 {isRegister ? '회원가입' : '로그인'}
          </h1>
          <p className="text-gray-500 mt-2">주간계획 플래너</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-modern"
              placeholder="teacher@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-modern"
              placeholder="••••••••"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                학급코드
              </label>
              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                required
                placeholder="예: 2024-1반"
                className="input-modern"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            {isRegister ? '회원가입' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
          >
            {isRegister ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
          </button>
        </div>
      </div>
    </div>
  );
}
