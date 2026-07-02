import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

function getSupabaseAnon() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null
  return createClient(url, anonKey)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Ověř že volající je admin přes JWT
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const token = authHeader.slice(7)

  const supabaseAnon = getSupabaseAnon()
  if (!supabaseAnon) return res.status(500).json({ error: 'Supabase není nakonfigurován' })

  const { data: { user: caller }, error: authErr } = await supabaseAnon.auth.getUser(token)
  if (authErr || !caller) return res.status(401).json({ error: 'Neplatný token' })
  if (caller.app_metadata?.role !== 'admin') return res.status(403).json({ error: 'Přístup odepřen' })

  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Chybí email nebo heslo' })

  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) return res.status(500).json({ error: 'Service role key chybí' })

  // Vytvoř uživatele v Supabase Auth
  const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createErr) {
    if (createErr.message?.includes('already been registered')) {
      return res.status(409).json({ error: 'Uživatel s tímto emailem již existuje' })
    }
    return res.status(500).json({ error: createErr.message })
  }

  const userId = newUser.user.id

  // Propoj orders s novým user_id
  await supabaseAdmin
    .from('orders')
    .update({ user_id: userId })
    .eq('email', email)

  // Ulož auth_user_id do customers
  await supabaseAdmin
    .from('customers')
    .update({ auth_user_id: userId })
    .eq('email', email)

  return res.status(200).json({ success: true, userId })
}
