import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import LandingPage from '@/pages/LandingPage'
import StudentDashboard from '@/pages/StudentDashboard'
import TeacherDashboard from '@/pages/TeacherDashboard'
import AdminDashboard from '@/pages/AdminDashboard'
import { useAuthStore } from '@/store/useAuthStore'

function ProtectedRoute({ children, role }: { children: JSX.Element; role: 'student' | 'teacher' | 'admin' }) {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />
  }

  return children
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}
