import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth, API_URL } from '../contexts/AuthContext';

interface Student {
  id: number;
  name: string;
  classNumber: number;
  classCode: string;
}

interface StudentStatus {
  id: number;
  name: string;
  class_number: number;
  role?: string;
  isCompleted: boolean;
  checkedCount: number;
  totalCount: number;
  roleChecked?: boolean;
  emotionChecked?: boolean;
}

interface CheckData {
  [date: string]: Array<{
    check_date: string;
    plan_id: number;
    plan_text: string;
    is_checked: number;
    display_order: number;
  }>;
}

interface EmotionFeedItem {
  emotion_id: number;
  student_id: number;
  student_name: string;
  emotion: string;
  reason: string;
  created_at: string;
  replies: Array<{
    id: number;
    teacher_id: number;
    reply_text: string;
    created_at: string;
  }>;
}

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

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState<StudentStatus[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [checkData, setCheckData] = useState<CheckData>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNumber, setNewStudentNumber] = useState('');
  const [newStudentRole, setNewStudentRole] = useState('');
  const [editingStudent, setEditingStudent] = useState<StudentStatus | null>(null);
  const [editName, setEditName] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [editRole, setEditRole] = useState('');
  const [emotionFeed, setEmotionFeed] = useState<EmotionFeedItem[]>([]);
  const [emotionFeedDate, setEmotionFeedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  useEffect(() => {
    fetchStudentStatus();
    fetchEmotionFeed();
  }, []);

  useEffect(() => {
    if (emotionFeedDate) {
      fetchEmotionFeed();
    }
  }, [emotionFeedDate]);

  useEffect(() => {
    if (selectedStudent && selectedDate) {
      fetchCheckData(selectedStudent.id, selectedDate);
    }
  }, [selectedStudent, selectedDate]);

  const fetchStudentStatus = async () => {
    try {
      console.log('fetchStudentStatus 호출, API_URL:', API_URL);
      const statusResponse = await axios.get(`${API_URL}/teacher/students/status`);
      const studentsResponse = await axios.get(`${API_URL}/teacher/students`);
      
      // role 정보를 status에 병합
      const studentsWithRole = statusResponse.data.map((status: StudentStatus) => {
        const studentInfo = studentsResponse.data.find((s: any) => s.id === status.id);
        return {
          ...status,
          role: studentInfo?.role || ''
        };
      });
      
      setStudents(studentsWithRole);
    } catch (error: any) {
      console.error('학생 상태 조회 실패:', error);
      console.error('에러 상세:', error.response?.data);
      console.error('요청 URL:', error.config?.url);
      alert(`학생 데이터를 불러오는데 실패했습니다: ${error.response?.data?.error || error.message}`);
    }
  };

  const fetchCheckData = async (studentId: number, date: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/teacher/students/${studentId}/checks?date=${date}`
      );
      setCheckData(response.data);
    } catch (error) {
      console.error('체크 데이터 조회 실패:', error);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/teacher/students`, {
        name: newStudentName,
        classNumber: parseInt(newStudentNumber),
        classCode: user?.classCode,
        role: newStudentRole
      });
      setNewStudentName('');
      setNewStudentNumber('');
      setNewStudentRole('');
      setShowAddStudent(false);
      fetchStudentStatus();
    } catch (error: any) {
      alert(error.response?.data?.error || '학생 추가에 실패했습니다.');
    }
  };

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      await axios.put(`${API_URL}/teacher/students/${editingStudent.id}`, {
        name: editName,
        classNumber: parseInt(editNumber),
        role: editRole
      });
      setEditingStudent(null);
      setEditName('');
      setEditNumber('');
      setEditRole('');
      fetchStudentStatus();
    } catch (error: any) {
      alert(error.response?.data?.error || '학생 수정에 실패했습니다.');
    }
  };

  const startEdit = (student: StudentStatus) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditNumber(student.class_number.toString());
    setEditRole(student.role || '');
  };

  const handleStudentClick = (student: StudentStatus) => {
    setSelectedStudent({
      id: student.id,
      name: student.name,
      classNumber: student.class_number,
      classCode: user?.classCode || ''
    });
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleDeleteStudent = async (e: React.MouseEvent, studentId: number) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    if (!confirm('정말 이 학생을 삭제하시겠습니까? 관련된 모든 데이터가 삭제됩니다.')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/teacher/students/${studentId}`);
      // 삭제된 학생이 선택된 학생이면 선택 해제
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(null);
      }
      fetchStudentStatus();
    } catch (error: any) {
      alert(error.response?.data?.error || '학생 삭제에 실패했습니다.');
    }
  };

  const fetchEmotionFeed = async () => {
    try {
      const response = await axios.get(`${API_URL}/teacher/emotion/feed/${emotionFeedDate}`);
      setEmotionFeed(response.data);
    } catch (error) {
      console.error('감정 피드 조회 실패:', error);
    }
  };

  const handleReplySubmit = async (emotionId: number) => {
    if (!replyText.trim()) {
      alert('답글을 입력해주세요.');
      return;
    }
    try {
      await axios.post(`${API_URL}/teacher/emotion/reply`, {
        emotionDataId: emotionId,
        replyText: replyText.trim()
      });
      setReplyingTo(null);
      setReplyText('');
      fetchEmotionFeed();
    } catch (error: any) {
      alert(error.response?.data?.error || '답글 작성에 실패했습니다.');
    }
  };

  const handleDeleteReply = async (replyId: number) => {
    if (!confirm('정말 이 답글을 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`${API_URL}/teacher/emotion/reply/${replyId}`);
      fetchEmotionFeed();
    } catch (error: any) {
      alert(error.response?.data?.error || '답글 삭제에 실패했습니다.');
    }
  };

  const getEmotionCategory = (emotion: string) => {
    return Object.values(EMOTION_CATEGORIES).find(cat => 
      cat.emotions.includes(emotion)
    ) || EMOTION_CATEGORIES.positive;
  };

  const getCardStyle = (student: StudentStatus) => {
    // 모든 계획과 교실역할까지 완료한 경우 초록색
    if (student.isCompleted) {
      return 'card border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50';
    }
    // 계획이 없는 경우 회색
    if (student.totalCount === 0) {
      return 'card border-2 border-gray-300 bg-white';
    }
    // 미완료인 경우 하얀색
    return 'card border-2 border-gray-300 bg-white';
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              교사 대시보드
            </h1>
            <p className="text-sm text-gray-500 mt-1">학급코드: {user?.classCode}</p>
          </div>
          <button
            onClick={logout}
            className="btn-primary bg-gradient-to-r from-red-500 to-pink-500"
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 감정 피드 섹션 */}
        <div className="card p-6 mb-6">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">학생 감정 피드</h2>
            <input
              type="date"
              value={emotionFeedDate}
              onChange={(e) => setEmotionFeedDate(e.target.value)}
              className="input-modern w-auto"
            />
          </div>

          {emotionFeed.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              해당 날짜에 공유된 감정이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {emotionFeed.map((item) => {
                const category = getEmotionCategory(item.emotion);
                
                return (
                  <div key={item.emotion_id} className="card overflow-hidden flex flex-col">
                    {/* 헤더 */}
                    <div className="p-3 border-b border-gray-200 flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {item.student_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 text-sm truncate">{item.student_name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* 감정 표시 */}
                    <div className={`p-3 bg-gradient-to-br ${category.bgColor} ${category.borderColor} border-l-4 flex-1 flex flex-col`}>
                      <div className="mb-2">
                        <span className={`px-2 py-1 rounded-full bg-gradient-to-r ${category.color} text-white font-semibold text-xs inline-block`}>
                          {item.emotion}
                        </span>
                      </div>
                      {item.reason && (
                        <div className="mt-2 p-2 bg-white rounded-lg flex-1 overflow-hidden">
                          <p className="text-gray-700 text-xs whitespace-pre-wrap line-clamp-4">{item.reason}</p>
                        </div>
                      )}
                      
                      {/* 답글 섹션 */}
                      <div className="mt-3 space-y-2">
                        {item.replies.map((reply) => (
                          <div key={reply.id} className="p-2 bg-blue-50 rounded-lg text-xs">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-gray-700 flex-1">{reply.reply_text}</p>
                              <button
                                onClick={() => handleDeleteReply(reply.id)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                삭제
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(reply.created_at).toLocaleString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        ))}
                        
                        {replyingTo === item.emotion_id ? (
                          <div className="space-y-2">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="답글을 입력하세요..."
                              rows={2}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg resize-none"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReplySubmit(item.emotion_id)}
                                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600"
                              >
                                작성
                              </button>
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText('');
                                }}
                                className="px-3 py-1 bg-gray-400 text-white rounded-lg text-xs hover:bg-gray-500"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReplyingTo(item.emotion_id)}
                            className="w-full px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            답글 작성
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">학생 목록</h2>
          <button
            onClick={() => setShowAddStudent(true)}
            className="btn-primary bg-gradient-to-r from-blue-500 to-cyan-500"
          >
            + 학생 추가
          </button>
        </div>

        {showAddStudent && (
          <div className="mb-6 card p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">학생 추가</h3>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="이름"
                  required
                  className="flex-1 input-modern"
                />
                <input
                  type="number"
                  value={newStudentNumber}
                  onChange={(e) => setNewStudentNumber(e.target.value)}
                  placeholder="학급번호"
                  required
                  className="w-32 input-modern"
                />
                <input
                  type="text"
                  value={newStudentRole}
                  onChange={(e) => setNewStudentRole(e.target.value)}
                  placeholder="교실역할 (예: 청소당번)"
                  className="flex-1 input-modern"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn-primary bg-gradient-to-r from-green-500 to-emerald-500"
                >
                  추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStudent(false);
                    setNewStudentName('');
                    setNewStudentNumber('');
                    setNewStudentRole('');
                  }}
                  className="px-6 py-3 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-colors font-semibold"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {editingStudent && (
          <div className="mb-6 card p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">학생 정보 수정</h3>
            <form onSubmit={handleEditStudent} className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="이름"
                  required
                  className="flex-1 input-modern"
                />
                <input
                  type="number"
                  value={editNumber}
                  onChange={(e) => setEditNumber(e.target.value)}
                  placeholder="학급번호"
                  required
                  className="w-32 input-modern"
                />
                <input
                  type="text"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  placeholder="교실역할"
                  className="flex-1 input-modern"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn-primary bg-gradient-to-r from-blue-500 to-cyan-500"
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingStudent(null);
                    setEditName('');
                    setEditNumber('');
                    setEditRole('');
                  }}
                  className="px-6 py-3 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-colors font-semibold"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {students.map((student) => (
            <div
              key={student.id}
              onClick={() => handleStudentClick(student)}
              className={`${getCardStyle(student)} p-5 card-hover cursor-pointer relative`}
            >
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEdit(student);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:scale-110"
                  title="학생 수정"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => handleDeleteStudent(e, student.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                  title="학생 삭제"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <div className="font-semibold text-lg text-gray-800">{student.name}</div>
              <div className="text-sm text-gray-600 mt-1">학급번호: {student.class_number}</div>
              {student.role && (
                <div className="text-sm text-purple-600 font-medium mt-1">역할: {student.role}</div>
              )}
              <div className="text-sm mt-2">
                {student.totalCount > 0 ? (
                  <>
                    <span className="text-gray-700">체크: {student.checkedCount}/{student.totalCount}</span>
                    {student.isCompleted && (
                      <span className="ml-2 text-blue-600 font-semibold">✓ 완료</span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-500">계획 없음</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedStudent && (
          <div className="card p-6 mt-6">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">{selectedStudent.name}의 계획 데이터</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="input-modern w-auto"
              />
            </div>

            {checkData[selectedDate] && checkData[selectedDate].length > 0 ? (
              <div className="space-y-2">
                {checkData[selectedDate].map((check) => (
                  <div
                    key={check.plan_id}
                    className={`p-3 rounded-lg ${
                      check.is_checked ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={check.is_checked ? 'text-green-600 font-bold' : 'text-gray-400'}>
                        {check.is_checked ? '✓' : '○'}
                      </span>
                      <span>{check.plan_text}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                해당 날짜에 체크 데이터가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

