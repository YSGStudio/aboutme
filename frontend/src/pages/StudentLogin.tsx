import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function StudentLogin() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [classNumber, setClassNumber] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        if (!email || !password) {
          throw new Error('이메일과 비밀번호를 입력해주세요.');
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { type: 'student', classCode }
          }
        });
        if (error) throw error;

        const authUserId = data.user?.id;
        if (!authUserId) throw new Error('회원가입에 실패했습니다.');

        const { data: teacher, error: teacherError } = await supabase
          .from('teachers')
          .select('id')
          .eq('class_code', classCode)
          .single();
        if (teacherError || !teacher) {
          throw new Error('학급코드가 올바르지 않습니다.');
        }

        const { data: created, error: createError } = await supabase
          .from('students')
          .insert({
            auth_user_id: authUserId,
            email,
            teacher_id: teacher.id,
            class_number: parseInt(classNumber, 10),
            name: studentName,
            class_code: classCode,
            role: ''
          })
          .select('id, name, class_code, class_number, email')
          .single();
        if (createError) throw createError;

        const sessionToken = data.session?.access_token;
        if (!sessionToken) {
          setError('이메일 인증 후 로그인해주세요.');
          return;
        }
        login(sessionToken, {
          id: created.id,
          name: created.name,
          classCode: created.class_code,
          classNumber: created.class_number,
          type: 'student'
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;

        const authUserId = data.user?.id;
        if (!authUserId) throw new Error('로그인에 실패했습니다.');

        const { data: student, error: fetchError } = await supabase
          .from('students')
          .select('id, name, class_code, class_number')
          .eq('auth_user_id', authUserId)
          .single();
        if (fetchError) throw fetchError;

        const sessionToken = data.session?.access_token;
        if (sessionToken) {
          login(sessionToken, {
            id: student.id,
            name: student.name,
            classCode: student.class_code,
            classNumber: student.class_number,
            type: 'student'
          });
        }
      }
      // localStorage에 저장된 후 네비게이션
      // window.location을 사용하여 강제 리다이렉트 (상태 업데이트 문제 방지)
      setTimeout(() => {
        window.location.href = '/student/dashboard';
      }, 100);
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }}>
      {/* 홈 버튼 */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center group"
        aria-label="홈으로 이동"
      >
        <svg className="w-6 h-6 text-pink-600 group-hover:text-pink-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>

      <div className="card w-full max-w-md p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
            학생 {isRegister ? '회원가입' : '로그인'}
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
              placeholder="student@example.com"
              className="input-modern"
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
              placeholder="••••••••"
              className="input-modern"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이름
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                placeholder="홍길동"
                className="input-modern"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              학급코드
            </label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              required={isRegister}
              placeholder="예: 2024-1반"
              className="input-modern"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              학급번호
            </label>
            <input
              type="number"
              value={classNumber}
              onChange={(e) => setClassNumber(e.target.value)}
              required={isRegister}
              placeholder="예: 1"
              className="input-modern"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full bg-gradient-to-r from-pink-600 to-red-600"
          >
            {isRegister ? '회원가입' : '로그인'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="w-full text-sm text-gray-600 hover:text-gray-800"
          >
            {isRegister ? '이미 계정이 있어요. 로그인하기' : '처음이에요. 회원가입하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
