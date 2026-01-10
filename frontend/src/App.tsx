import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TeacherLogin from './pages/TeacherLogin';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import StudentStats from './pages/StudentStats';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute userType="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute userType="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/stats"
            element={
              <ProtectedRoute userType="student">
                <StudentStats />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/teacher/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

