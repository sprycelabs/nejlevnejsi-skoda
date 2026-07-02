import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, ShieldCheck } from 'lucide-react'

export default function AdminPanel() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Topbar */}
      <header className="border-b border-[#30363d] bg-[#161b22]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-[#28a745]" />
            <span className="font-black text-sm tracking-tight">Admin Panel</span>
            <span className="text-[#30363d]">/</span>
            <span className="text-gray-500 text-sm">nejlevnejsi-skoda.cz</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-xs">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors"
            >
              <LogOut size={14} />
              Odhlásit
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-black text-white">Admin Panel</h1>
        <p className="text-gray-500 mt-2">Vítej, {user?.email}</p>
      </main>
    </div>
  )
}
