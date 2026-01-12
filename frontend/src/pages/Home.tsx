import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="w-full max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            주간계획 플래너
          </h1>
          <p className="text-white/90 text-lg md:text-xl">
            학생들과 함께 주간계획을 세우고 실천해보세요
          </p>
        </div>

        {/* 선택 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* 교사 카드 */}
          <div
            onClick={() => navigate('/teacher/login')}
            className="card p-8 md:p-10 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                교사
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                학생 계정을 생성하고<br />
                학생들의 실천 상태를 확인하세요
              </p>
              <button className="btn-primary w-full bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:from-purple-700 group-hover:to-indigo-700">
                교사 로그인
              </button>
            </div>
          </div>

          {/* 학생 카드 */}
          <div
            onClick={() => navigate('/student/login')}
            className="card p-8 md:p-10 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                학생
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                주간계획을 설정하고<br />
                매일 실천 여부를 체크하세요
              </p>
              <button className="btn-primary w-full bg-gradient-to-r from-pink-600 to-red-600 group-hover:from-pink-700 group-hover:to-red-700">
                학생 로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
