import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth, API_URL } from '../contexts/AuthContext';

interface Plan {
  id: number;
  plan_text: string;
  display_order: number;
}

interface CheckItem {
  plan_id: number;
  plan_text: string;
  display_order: number;
  is_checked: number;
  check_id?: number;
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [, setPlans] = useState<Plan[]>([]);
  const [checks, setChecks] = useState<CheckItem[]>([]);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [newPlanText, setNewPlanText] = useState('');
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [editingPlanText, setEditingPlanText] = useState('');
  const [role, setRole] = useState<string>('');
  const [roleChecked, setRoleChecked] = useState<number>(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [emotionReason, setEmotionReason] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hasEmotionToday, setHasEmotionToday] = useState<boolean>(false);
  const [emotionFeed, setEmotionFeed] = useState<Array<{
    emotion_id: number;
    student_id: number;
    student_name: string;
    emotion: string;
    reason: string;
    created_at: string;
    replies?: Array<{
      id: number;
      teacher_id: number;
      reply_text: string;
      created_at: string;
    }>;
  }>>([]);

  const EMOTION_CATEGORIES = {
    positive: {
      name: '긍정적 감정',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      emotions: [
        '기쁘다', '행복하다', '즐겁다', '만족하다', '뿌듯하다', '자신있다', '희망차다', 
        '상쾌하다', '고맙다', '감동하다', '사랑하다', '다정하다', '편안하다', '신기하다', 
        '열정적이다', '자랑하다'
      ]
    },
    negative: {
      name: '부정적 감정',
      color: 'from-red-400 to-pink-500',
      bgColor: 'from-red-50 to-pink-50',
      borderColor: 'border-red-300',
      emotions: [
        '슬프다', '우울하다', '화나다', '짜증나다', '실망하다', '좌절하다', '불안하다', 
        '걱정스럽다', '두렵다', '역겹다', '밉다', '억울하다', '창피하다', '서럽다', 
        '후회하다', '질투하다', '불쌍하다', '외롭다', '포기하다'
      ]
    },
    complex: {
      name: '복합적 감정',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-300',
      emotions: [
        '놀라다', '궁금하다', '당황하다', '부담스럽다', '수줍다', '지루하다'
      ]
    },
    relational: {
      name: '관계적 감정',
      color: 'from-blue-400 to-purple-500',
      bgColor: 'from-blue-50 to-purple-50',
      borderColor: 'border-blue-300',
      emotions: [
        '그립다', '미안하다', '믿다', '부럽다'
      ]
    }
  };

  const getAllEmotions = () => {
    return Object.values(EMOTION_CATEGORIES).flatMap(category => category.emotions);
  };

  const getDisplayedEmotions = () => {
    if (selectedCategory === 'all') {
      return getAllEmotions();
    }
    return EMOTION_CATEGORIES[selectedCategory as keyof typeof EMOTION_CATEGORIES]?.emotions || [];
  };

  useEffect(() => {
    fetchPlans();
    fetchTodayChecks();
    fetchRoleInfo();
  }, []);
    try {
      const now = new Date();
      const hour = now.getHours();
      const today = now.toISOString().split('T')[0];
      
      // 새벽 1시 이후인지 확인
      if (hour >= 1) {
        // 새벽 1시 이후: 오늘 날짜의 감정 확인
        const response = await axios.get(`${API_URL}/student/emotion/today`);
        const hasEmotion = !!(response.data.emotion && response.data.emotion.trim() !== '');
        
        if (hasEmotion) {
          setHasEmotionToday(true);
          setSelectedEmotion(response.data.emotion || '');
          setEmotionReason(response.data.reason || '');
          fetchEmotionFeed(today);
        } else {
          setHasEmotionToday(false);
          setSelectedEmotion('');
          setEmotionReason('');
        }
      } else {
        // 새벽 1시 이전: 어제 날짜의 감정 피드 표시
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.toISOString().split('T')[0];
        
        try {
          const feedResponse = await axios.get(`${API_URL}/student/emotion/feed/${yesterdayDate}`);
          const hasMyEmotion = feedResponse.data.some((item: any) => item.student_id === user?.id);
          
          if (hasMyEmotion) {
            setHasEmotionToday(true);
            fetchEmotionFeed(yesterdayDate);
          } else {
            setHasEmotionToday(false);
          }
        } catch (error) {
          setHasEmotionToday(false);
        }
      }
    } catch (error) {
      console.error('감정 데이터 조회 실패:', error);
      setHasEmotionToday(false);
    }
  };

  const fetchEmotionFeed = async (date: string) => {
    try {
      const response = await axios.get(`${API_URL}/student/emotion/feed/${date}`);
      setEmotionFeed(response.data);
    } catch (error) {
      console.error('감정 피드 조회 실패:', error);
    }
  };

  const handleSaveEmotion = async () => {
    if (!selectedEmotion) {
      alert('감정을 선택해주세요.');
      return;
    }
    try {
      const today = new Date().toISOString().split('T')[0];
      await axios.post(`${API_URL}/student/emotion`, {
        date: today,
        emotion: selectedEmotion,
        reason: emotionReason
      });
      
      setHasEmotionToday(true);
      // 피드 데이터 불러오기
      await fetchEmotionFeed(today);
    } catch (error: any) {
      alert(error.response?.data?.error || '감정 저장에 실패했습니다.');
    }
  };

  // 새벽 1시 기준으로 감정 입력 창/피드 전환 감지
  useEffect(() => {
    const checkTimeAndDate = async () => {
      const now = new Date();
      const hour = now.getHours();
      const today = now.toISOString().split('T')[0];
      
      // 새벽 1시 이후인지 확인
      if (hour >= 1) {
        // 오늘 날짜의 감정 확인
        try {
          const response = await axios.get(`${API_URL}/student/emotion/today`);
          const hasEmotion = !!(response.data.emotion && response.data.emotion.trim() !== '');
          
          if (hasEmotion) {
            setHasEmotionToday(true);
            setSelectedEmotion(response.data.emotion || '');
            setEmotionReason(response.data.reason || '');
            fetchEmotionFeed(today);
          } else {
            setHasEmotionToday(false);
            setSelectedEmotion('');
            setEmotionReason('');
          }
        } catch (error) {
          setHasEmotionToday(false);
        }
      } else {
        // 새벽 1시 이전이면 어제 감정 피드 표시
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.toISOString().split('T')[0];
        
        try {
          const feedResponse = await axios.get(`${API_URL}/student/emotion/feed/${yesterdayDate}`);
          const hasMyEmotion = feedResponse.data.some((item: any) => item.student_id === user?.id);
          
          if (hasMyEmotion) {
            setHasEmotionToday(true);
            fetchEmotionFeed(yesterdayDate);
          } else {
            setHasEmotionToday(false);
          }
        } catch (error) {
          setHasEmotionToday(false);
        }
      }
    };
    
    // 매 분마다 확인 (새벽 1시 체크)
    const interval = setInterval(checkTimeAndDate, 60000);
    checkTimeAndDate(); // 초기 실행
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRoleInfo = async () => {
    try {
      const infoResponse = await axios.get(`${API_URL}/student/info`);
      setRole(infoResponse.data.role || '');
      
      const checkResponse = await axios.get(`${API_URL}/student/role/check/today`);
      setRoleChecked(checkResponse.data.is_checked || 0);
    } catch (error) {
      console.error('교실역할 정보 조회 실패:', error);
    }
  };

  const handleRoleCheck = async (isChecked: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await axios.post(`${API_URL}/student/role/check`, {
        date: today,
        isChecked: isChecked
      });
      setRoleChecked(isChecked);
    } catch (error: any) {
      alert(error.response?.data?.error || '교실역할 체크에 실패했습니다.');
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${API_URL}/student/plans`);
      setPlans(response.data);
    } catch (error) {
      console.error('계획 조회 실패:', error);
    }
  };

  const fetchTodayChecks = async () => {
    try {
      const response = await axios.get(`${API_URL}/student/checks/today`);
      setChecks(response.data);
    } catch (error) {
      console.error('체크 데이터 조회 실패:', error);
    }
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/student/plans`, {
        planText: newPlanText
      });
      setNewPlanText('');
      setShowPlanForm(false);
      fetchPlans();
      fetchTodayChecks();
    } catch (error: any) {
      alert(error.response?.data?.error || '계획 추가에 실패했습니다.');
    }
  };

  const handleUpdatePlan = async (planId: number) => {
    try {
      await axios.put(`${API_URL}/student/plans/${planId}`, {
        planText: editingPlanText
      });
      setEditingPlanId(null);
      setEditingPlanText('');
      fetchPlans();
    } catch (error: any) {
      alert(error.response?.data?.error || '계획 수정에 실패했습니다.');
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!confirm('정말 이 계획을 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`${API_URL}/student/plans/${planId}`);
      fetchPlans();
      fetchTodayChecks();
    } catch (error: any) {
      alert(error.response?.data?.error || '계획 삭제에 실패했습니다.');
    }
  };

  const handleSetCheckStatus = async (planId: number, isChecked: number) => {
    const today = new Date().toISOString().split('T')[0];
    try {
      await axios.post(`${API_URL}/student/checks`, {
        planId,
        date: today,
        isChecked: isChecked
      });
      fetchTodayChecks();
    } catch (error: any) {
      alert(error.response?.data?.error || '체크 상태 변경에 실패했습니다.');
    }
  };

  const getCompletionRate = () => {
    if (checks.length === 0) return 0;
    // 완료(1) 또는 미완료(0) 모두 체크된 것으로 간주
    const checkedCount = checks.filter(c => c.is_checked === 1 || c.is_checked === 0).length;
    return Math.round((checkedCount / checks.length) * 100);
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }}>
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
            {user?.name}님의 주간계획
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/student/stats')}
              className="btn-primary bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              통계 보기
            </button>
            <button
              onClick={logout}
              className="btn-primary bg-gradient-to-r from-red-500 to-pink-500"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 감정 공유 섹션 또는 피드 */}
        {!hasEmotionToday ? (
          <div className="mb-6 card p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">오늘의 감정 공유</h2>
            <div className="space-y-4">
            {/* 카테고리 선택 탭 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                감정 카테고리
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  전체
                </button>
                {Object.entries(EMOTION_CATEGORIES).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      selectedCategory === key
                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 감정 선택 버튼 그리드 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                감정 선택
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 bg-white rounded-xl border-2 border-gray-200">
                {getDisplayedEmotions().map((emotion) => {
                  const category = Object.values(EMOTION_CATEGORIES).find(cat => 
                    cat.emotions.includes(emotion)
                  ) || EMOTION_CATEGORIES.positive;
                  
                  return (
                    <button
                      key={emotion}
                      onClick={() => setSelectedEmotion(emotion)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedEmotion === emotion
                          ? `bg-gradient-to-r ${category.color} text-white shadow-md scale-105`
                          : `bg-gradient-to-br ${category.bgColor} ${category.borderColor} border hover:scale-105`
                      }`}
                    >
                      {emotion}
                    </button>
                  );
                })}
              </div>
              {selectedEmotion && (
                <div className="mt-2 text-sm text-gray-600">
                  선택한 감정: <span className="font-semibold text-gray-800">{selectedEmotion}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이유
              </label>
              <textarea
                value={emotionReason}
                onChange={(e) => setEmotionReason(e.target.value)}
                placeholder="왜 그런 감정을 느꼈는지 적어주세요..."
                rows={3}
                className="input-modern w-full resize-none"
              />
            </div>
            <button
              onClick={handleSaveEmotion}
              className="btn-primary bg-gradient-to-r from-yellow-500 to-orange-500 w-full"
            >
              저장하기
            </button>
          </div>
        </div>
        ) : (
          <div className="mb-6">
            <div className="card p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">오늘의 감정 피드</h2>
                <div className="text-sm text-gray-600">
                  내 감정: <span className="font-semibold text-gray-800">{selectedEmotion}</span>
                </div>
              </div>
            </div>
            
            {/* 인스타그램 스타일 피드 - 그리드 레이아웃 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {emotionFeed.length === 0 ? (
                <div className="col-span-full card p-8 text-center">
                  <p className="text-gray-500">아직 공유된 감정이 없습니다.</p>
                </div>
              ) : (
                emotionFeed.map((item) => {
                  const category = Object.values(EMOTION_CATEGORIES).find(cat => 
                    cat.emotions.includes(item.emotion)
                  ) || EMOTION_CATEGORIES.positive;
                  
                  // 파스텔 톤 배경색 매핑
                  const pastelBgColors: Record<string, string> = {
                    'positive': 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50',
                    'negative': 'bg-gradient-to-br from-rose-100 via-pink-50 to-red-50',
                    'complex': 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-50',
                    'relational': 'bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-50'
                  };
                  
                  const categoryKey = Object.keys(EMOTION_CATEGORIES).find(key => 
                    EMOTION_CATEGORIES[key as keyof typeof EMOTION_CATEGORIES] === category
                  ) || 'positive';
                  
                  return (
                    <div 
                      key={item.emotion_id} 
                      className={`overflow-hidden flex flex-col rounded-xl shadow-md border-2 ${category.borderColor} ${pastelBgColors[categoryKey]}`}
                    >
                      {/* 헤더 */}
                      <div className="p-3 border-b border-white/50 backdrop-blur-sm bg-white/30 flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
                          {item.student_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-800 text-sm truncate">{item.student_name}</div>
                          <div className="text-xs text-gray-600">
                            {new Date(item.created_at).toLocaleString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* 감정 표시 */}
                      <div className={`p-3 flex-1 flex flex-col`}>
                        <div className="mb-2">
                          <span className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${category.color} text-white font-semibold text-xs inline-block shadow-sm`}>
                            {item.emotion}
                          </span>
                        </div>
                        {item.reason && (
                          <div className="mt-2 p-3 bg-white/70 backdrop-blur-sm rounded-lg flex-1 overflow-hidden border border-white/50">
                            <p className="text-gray-700 text-xs whitespace-pre-wrap line-clamp-4">{item.reason}</p>
                          </div>
                        )}
                        
                        {/* 답글 표시 (학생용) */}
                        {item.replies && item.replies.length > 0 && (
                          <div className="mt-3 space-y-1.5">
                            {item.replies.map((reply) => (
                              <div key={reply.id} className="p-2.5 bg-white/80 backdrop-blur-sm rounded-lg text-xs border border-white/50 shadow-sm">
                                <p className="text-gray-700">{reply.reply_text}</p>
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(reply.created_at).toLocaleString('ko-KR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 교실역할 섹션 */}
        {role && (
          <div className="mb-6 card p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">교실역할</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-purple-700">{role}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRoleCheck(1)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    roleChecked === 1
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ✓ 완료
                </button>
                <button
                  onClick={() => handleRoleCheck(0)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    roleChecked === 0
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ✗ 미완료
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">오늘의 계획</h2>
            <button
              onClick={() => setShowPlanForm(!showPlanForm)}
              className="btn-primary bg-gradient-to-r from-blue-500 to-cyan-500"
            >
              {showPlanForm ? '취소' : '+ 계획 추가'}
            </button>
          </div>

          {showPlanForm && (
            <form onSubmit={handleAddPlan} className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newPlanText}
                  onChange={(e) => setNewPlanText(e.target.value)}
                  placeholder="새로운 계획을 입력하세요"
                  required
                  className="flex-1 input-modern"
                />
                <button
                  type="submit"
                  className="btn-primary bg-gradient-to-r from-green-500 to-emerald-500"
                >
                  추가
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3 mb-6">
            {checks.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                계획이 없습니다. 계획을 추가해주세요.
              </div>
            ) : (
              checks.map((check) => (
                <div
                  key={check.plan_id}
                  className={`p-5 rounded-2xl border-2 transition-all ${
                    check.is_checked === 1
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-md'
                      : check.is_checked === 0
                      ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-400 shadow-md'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {editingPlanId === check.plan_id ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editingPlanText}
                            onChange={(e) => setEditingPlanText(e.target.value)}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdatePlan(check.plan_id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                          >
                            저장
                          </button>
                          <button
                            onClick={() => {
                              setEditingPlanId(null);
                              setEditingPlanText('');
                            }}
                            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 text-gray-800">{check.plan_text}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSetCheckStatus(check.plan_id, 1)}
                              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                check.is_checked === 1
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                                  : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-cyan-500 shadow-md'
                              }`}
                            >
                              ✓ 완료
                            </button>
                            <button
                              onClick={() => handleSetCheckStatus(check.plan_id, 0)}
                              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                check.is_checked === 0
                                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105'
                                  : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-cyan-500 shadow-md'
                              }`}
                            >
                              ✗ 미완료
                            </button>
                            <div className="flex gap-2 ml-2">
                              <button
                                onClick={() => {
                                  setEditingPlanId(check.plan_id);
                                  setEditingPlanText(check.plan_text);
                                }}
                                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => handleDeletePlan(check.plan_id)}
                                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">오늘의 실천률</span>
              <span className="text-sm font-semibold text-gray-800">
                {getCompletionRate()}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-6 rounded-full transition-all duration-300 flex items-center justify-center"
                style={{ width: `${getCompletionRate()}%` }}
              >
                {getCompletionRate() > 0 && (
                  <span className="text-white text-xs font-semibold">
                    {getCompletionRate()}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

