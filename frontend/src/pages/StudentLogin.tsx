import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth, API_URL } from '../contexts/AuthContext';

export default function StudentLogin() {
  const [classCode, setClassCode] = useState('');
  const [classNumber, setClassNumber] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/student/login`, {
        classCode,
        classNumber: parseInt(classNumber)
      });

      login(response.data.token, response.data.user);
      // React 상태 업데이트를 기다린 후 네비게이션
      requestAnimationFrame(() => {
        navigate('/student/dashboard', { replace: true });
      });
    } catch (err: any) {
      setError(err.response?.data?.error || '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }}>
      <div className="card w-full max-w-md p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
            학생 로그인
          </h1>
          <p className="text-gray-500 mt-2">주간계획 플래너</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              학급번호
            </label>
            <input
              type="number"
              value={classNumber}
              onChange={(e) => setClassNumber(e.target.value)}
              required
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
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
