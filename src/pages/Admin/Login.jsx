import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const ADMIN_EMAILS = ['schonfeldmatej33@gmail.com']

export default function AdminLogin() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user && ADMIN_EMAILS.includes(user.email)) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      setError('Nesprávný e-mail nebo heslo.')
      setLoading(false)
      return
    }

    if (!ADMIN_EMAILS.includes(email)) {
      setError('Tento účet nemá přístup do administrace.')
      setLoading(false)
      return
    }

    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-900/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1e7e34]/20 rounded-xl border border-[#1e7e34]/30 mb-4">
            <ShieldCheck size={22} className="text-[#28a745]" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Administrace</h1>
          <p className="text-gray-500 text-sm">Přihlaste se pro přístup do admin panelu</p>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@email.cz"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#28a745] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Heslo
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#28a745] transition-colors"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-900/20 border border-red-800/50 rounded-lg px-4 py-3"
              >
                <AlertCircle size={15} className="text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#1e7e34] hover:bg-[#28a745] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={15} />
                  Přihlásit se
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          nejlevnejsi-skoda.cz &mdash; Admin Panel
        </p>
      </motion.div>
    </div>
  )
}
