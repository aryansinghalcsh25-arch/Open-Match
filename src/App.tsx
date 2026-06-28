import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import ProjectListingPage from './pages/ProjectListingPage'
import LoginPage from './pages/LoginPage'

function LandingPage() {
  return <div>Landing Page — Coming Soon</div>
}

function ForgotPasswordPage() {
  return <div>Forgot Password — Coming Soon</div>
}

function ResetPasswordPage() {
  return <div>Reset Password — Coming Soon</div>
}

function NotFoundPage() {
  return <div>404 — Page Not Found</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectListingPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  )
}