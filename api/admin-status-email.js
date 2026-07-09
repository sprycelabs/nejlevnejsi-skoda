import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = 'platby@nejlevnejsi-skoda.cz'

function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

function getSupabaseAnon() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

const STATUS_CONFIG = {
  zpracovava_se: {
    subject:  'Vaše objednávka se zpracovává',
    headline: 'Zpracováváme vaši objednávku',
    message:  'Vaši objednávku jsme přijali a právě ji zpracováváme. Objednáváme váš vůz u evropského dealera. Ozveme se vám s dalšími informacemi.',
  },
  potvrzeno_dealerem: {
    subject:  'Váš vůz byl potvrzen dealerem',
    headline: 'Vůz potvrzen dealerem',
    message:  'Skvělá zpráva! Váš vůz byl úspěšně potvrzen evropským dealerem. Přípravy na expedici jsou v plném proudu.',
  },
  na_ceste: {
    subject:  'Váš vůz je na cestě!',
    headline: 'Vůz míří do České republiky',
    message:  'Váš vůz byl expedován a právě míří do České republiky. Budeme vás průběžně informovat o dalším postupu a termínu doručení.',
  },
  prihlasovani: {
    subject:  'Přihlašování vozu — potřebujeme vaši součinnost',
    headline: 'Přihlašujeme váš vůz',
    message:  'Váš vůz dorazil a právě probíhá jeho přihlášení v České republice. V případě potřeby vás budeme kontaktovat.',
  },
  dorucovani: {
    subject:  'Váš vůz se doručuje',
    headline: 'Vůz je na cestě za vámi',
    message:  'Váš vůz je přihlášen a nyní probíhá jeho doručení. Brzy se ozveme s přesným termínem předání.',
  },
  doruceno: {
    subject:  'Váš vůz byl doručen — gratulujeme!',
    headline: 'Vůz úspěšně doručen',
    message:  'Váš vůz byl úspěšně doručen. Děkujeme za důvěru a přejeme mnoho bezpečných kilometrů! Pokud budete cokoliv potřebovat, jsme tu pro vás.',
  },
}

function buildEmail({ config, customerName, orderNumber }) {
  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr><td style="background:#0d1f10;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
          <div style="color:#28a745;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Aktualizace objednávky</div>
          <div style="color:#ffffff;font-size:24px;font-weight:900;">${config.headline}</div>
        </td></tr>

        <tr><td style="background:#ffffff;padding:40px;">
          <p style="margin:0 0 20px;font-size:18px;font-weight:900;color:#111827;">Dobrý den, ${customerName},</p>
          <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.7;">${config.message}</p>

          <div style="background:#f0faf2;border:1px solid #d4edda;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color:#6b7280;font-size:13px;">Číslo objednávky</td>
                <td style="color:#1e7e34;font-size:16px;font-weight:900;text-align:right;">${orderNumber}</td>
              </tr>
            </table>
          </div>

          <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
            V případě dotazů nás kontaktujte na
            <a href="tel:+420733455966" style="color:#1e7e34;">+420 733 455 966</a> nebo
            <a href="mailto:info@nejlevnejsi-skoda.cz" style="color:#1e7e34;">info@nejlevnejsi-skoda.cz</a>.
          </p>
        </td></tr>

        <tr><td style="background:#f9fafb;border:1px solid #f0f0f0;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
          <p style="margin:0;color:#9ca3af;font-size:11px;">© ${new Date().getFullYear()} Nejlevnejsi-Skoda.cz · Všechna práva vyhrazena</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = req.headers.authorization?.slice(7)
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  const supabaseAnon = getSupabaseAnon()
  const { data: { user: caller }, error: authErr } = await supabaseAnon.auth.getUser(token)
  if (authErr || !caller) return res.status(401).json({ error: 'Neplatný token' })
  if (caller.app_metadata?.role !== 'admin') return res.status(403).json({ error: 'Přístup odepřen' })

  const { orderNumber, status } = req.body
  if (!orderNumber || !status) return res.status(400).json({ error: 'Chybí orderNumber nebo status' })

  const config = STATUS_CONFIG[status]
  if (!config) return res.status(200).json({ skipped: true, reason: 'Tento status nemá email' })

  const supabase = getSupabaseAdmin()
  const { data: rows, error: dbErr } = await supabase
    .from('orders')
    .select('email, first_name, last_name, company_name')
    .eq('order_number', orderNumber)
    .limit(1)

  if (dbErr || !rows?.length) return res.status(404).json({ error: 'Objednávka nenalezena' })

  const o = rows[0]
  const customerName = o.company_name || [o.first_name, o.last_name].filter(Boolean).join(' ') || o.email

  try {
    await resend.emails.send({
      from:    `Nejlevnější Škoda CZ <${FROM}>`,
      to:      o.email,
      subject: `${config.subject} · ${orderNumber}`,
      html:    buildEmail({ config, customerName, orderNumber }),
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Status email error:', err)
    return res.status(500).json({ error: err.message })
  }
}
