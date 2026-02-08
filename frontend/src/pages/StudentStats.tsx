import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth, API_URL } from '../contexts/AuthContext';

interface PlanStat {
  id: number;
  plan_text: string;
  total_checks: number;
  checked_count: number;
  success_rate: number;
}

interface DateStat {
  date: string;
  emotion: string;
  reason: string;
}

interface EmotionStat {
  emotion: string;
  count: number;
}

interface StatsData {
  planStats: PlanStat[];
  emotionStats: EmotionStat[];
}

export default function StudentStats() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [dateStat, setDateStat] = useState<DateStat | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchDateStat(selectedDate);
    } else {
      setDateStat(null);
    }
  }, [selectedDate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/student/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('통계 데이터 조회 실패:', error);
    }
  };

  const fetchDateStat = async (date: string) => {
    try {
      const response = await axios.get(`${API_URL}/student/stats/date/${date}`);
      setDateStat(response.data);
    } catch (error) {
      console.error('날짜별 데이터 조회 실패:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }}>
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
            {user?.name}님의 통계
          </h1>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="btn-primary bg-gradient-to-r from-blue-500 to-cyan-500"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* 감정 통계 섹션 */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">가장 많이 선택한 감정 TOP 5</h2>
          {stats.emotionStats && stats.emotionStats.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* 원형 그래프 */}
              <div className="relative">
                <svg width="300" height="300" viewBox="0 0 300 300" className="transform -rotate-90">
                  {(() => {
                    const total = stats.emotionStats.reduce((sum, stat) => sum + stat.count, 0);
                    const colors = [
                      '#fbbf24', // yellow-400
                      '#60a5fa', // blue-400
                      '#34d399', // green-400
                      '#a78bfa', // purple-400
                      '#9ca3af'  // gray-400
                    ];
                    let currentAngle = 0;
                    const radius = 120;
                    const centerX = 150;
                    const centerY = 150;
                    
                    return stats.emotionStats.map((stat, index) => {
                      const angle = (stat.count / total) * 360;
                      const startAngle = currentAngle;
                      const endAngle = currentAngle + angle;
                      
                      const startAngleRad = (startAngle * Math.PI) / 180;
                      const endAngleRad = (endAngle * Math.PI) / 180;
                      
                      const x1 = centerX + radius * Math.cos(startAngleRad);
                      const y1 = centerY + radius * Math.sin(startAngleRad);
                      const x2 = centerX + radius * Math.cos(endAngleRad);
                      const y2 = centerY + radius * Math.sin(endAngleRad);
                      
                      const largeArcFlag = angle > 180 ? 1 : 0;
                      
                      const pathData = [
                        `M ${centerX} ${centerY}`,
                        `L ${x1} ${y1}`,
                        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                        'Z'
                      ].join(' ');
                      
                      currentAngle += angle;
                      
                      return (
                        <path
                          key={stat.emotion}
                          d={pathData}
                          fill={colors[index]}
                          stroke="white"
                          strokeWidth="2"
                          className="transition-all duration-500 hover:opacity-80"
                        />
                      );
                    });
                  })()}
                </svg>
                {/* 중앙 텍스트 */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">
                      {stats.emotionStats.reduce((sum, stat) => sum + stat.count, 0)}
                    </div>
                    <div className="text-sm text-gray-600">총 선택</div>
                  </div>
                </div>
              </div>
              
              {/* 범례 */}
              <div className="space-y-4 flex-1">
                {stats.emotionStats.map((stat, index) => {
                  const total = stats.emotionStats.reduce((sum, s) => sum + s.count, 0);
                  const percentage = ((stat.count / total) * 100).toFixed(1);
                  const colors = [
                    'bg-yellow-400',
                    'bg-blue-400',
                    'bg-green-400',
                    'bg-purple-400',
                    'bg-gray-400'
                  ];
                  
                  return (
                    <div key={stat.emotion} className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full ${colors[index]} flex-shrink-0`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-lg font-semibold text-gray-800">{stat.emotion}</span>
                          <span className="text-sm font-bold text-gray-600">{stat.count}회</span>
                        </div>
                        <div className="text-sm text-gray-500">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              아직 선택한 감정이 없습니다.
            </div>
          )}
        </div>

        {/* 날짜 선택 섹션 */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">날짜별 데이터 조회</h2>
          <div className="mb-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-modern"
            />
          </div>
          {dateStat && (
            <div className="mt-4">
              <div className="text-lg font-medium text-gray-800 mb-2">
                {formatDate(dateStat.date)}
              </div>
              {dateStat.emotion ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">감정</span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {dateStat.emotion}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">이유</div>
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 whitespace-pre-wrap">
                      {dateStat.reason || '이유가 입력되지 않았습니다.'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  해당 날짜에 감정 데이터가 없습니다.
                </div>
              )}
            </div>
          )}
        </div>

        {/* 계획 항목별 완료률 섹션 */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">계획 항목별 완료률</h2>
          {stats.planStats.length === 0 ? (
            <div className="text-gray-500 text-center py-8">데이터가 없습니다.</div>
          ) : (
            <div className="space-y-4">
              {stats.planStats.map((plan) => (
                <div key={plan.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-800">{plan.plan_text}</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {plan.success_rate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full ${
                        plan.success_rate >= 80
                          ? 'bg-green-500'
                          : plan.success_rate >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${plan.success_rate}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {plan.checked_count}/{plan.total_checks} 완료
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
