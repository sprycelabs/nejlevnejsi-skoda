import { createContext, useContext, useEffect, useState } from 'react'
import { supabaseAdmin } from '../lib/supabaseAdmin'

const AdminAuthContext = createContext(null)

function isAdminUser(user) {
  return user?.app_metadata?.role === 'admin'
}

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabaseAdmin) {
      setLoading(false)
      return
    }

    supabaseAdmin.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabaseAdmin.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    if (!supabaseAdmin) return { error: { message: 'Supabase není nakonfigurován' } }
    return supabaseAdmin.auth.signInWithPassword({ email, password })
  }

  const signOut = async () => {
    if (!supabaseAdmin) return
    await supabaseAdmin.auth.signOut()
  }

  return (
    <AdminAuthContext.Provider value={{ user, loading, signIn, signOut, isAdmin: isAdminUser(user) }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
