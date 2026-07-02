import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ADMIN_EMAILS = ['schonfeldmatej33@gmail.com']

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#28a745] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
