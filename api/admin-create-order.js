import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { generateInvoicePDF } from './generateInvoice.js'

const PROFORMA_DEPOSIT_PCT = 0.20

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

function loadLogoBase64() {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'public', 'logo.png')).toString('base64')
  } catch { return null }
}

function generateVariableSymbol(orderNumber) {
  const parts = orderNumber.split('-')
  const year  = String(parts[1] || new Date().getFullYear()).slice(-2)
  const seq   = (parts[2] || '001').padStart(3, '0')
  const rand  = String(Math.floor(10000 + Math.random() * 90000))
  return `${year}${seq}${rand}`
}

async function generateOrderNumber(supabaseAdmin) {
  const year = new Date().getFullYear()
  const { data } = await supabaseAdmin
    .from('orders')
    .select('order_number')
    .like('order_number', `OBJ-${year}-%`)
    .order('created_at', { ascending: false })
    .limit(1)

  let count = 1
  if (data?.length > 0) {
    const parts = (data[0].order_number || '').split('-')
    const num = parseInt(parts[2] || '0')
    if (!isNaN(num)) count = num + 1
  }
  return `OBJ-${year}-${String(count).padStart(3, '0')}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Ověř admin JWT
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

  const supabase = getSupabaseAdmin()
  if (!supabase) return res.status(500).json({ error: 'Service role key chybí' })

  const { form, items, customerType, paymentMethod, discount, manualDiscount, charity, status } = req.body

  if (!form?.email || !items?.length) {
    return res.status(400).json({ error: 'Chybí povinná data' })
  }

  try {
    const orderNumber    = await generateOrderNumber(supabase)
    const variableSymbol = generateVariableSymbol(orderNumber)
    const logoBase64     = loadLogoBase64()

    // Kombinovaná sleva pro PDF (kód + manuální dohromady)
    const totalBase     = items.reduce((s, { car, qty }) => s + car.salePrice * qty, 0)
    const codeAmt       = discount?.amount ?? 0
    const manualAmt     = manualDiscount?.amount ?? 0
    const totalDiscount = codeAmt + manualAmt

    const pdfDiscount = totalDiscount > 0 ? {
      code:   discount?.code || manualDiscount?.label || 'Sleva',
      type:   'fixed',
      amount: totalDiscount,
    } : null

    // Vygeneruj PDF (items musí mít car.salePrice = admin cena)
    const formForPdf = {
      ...form,
      companyName:   customerType === 'firma' ? form.companyName : null,
      contactPerson: customerType === 'firma' ? form.contactPerson : null,
      note:          form.notes,
    }

    const pdfBuffer = await generateInvoicePDF({
      form:           formForPdf,
      items,
      orderNumber,
      logoBase64,
      variableSymbol,
      discount:       pdfDiscount,
      paymentMethod,
    })

    // Ulož PDF do Supabase Storage
    const invoiceFilename = `faktura-${orderNumber}.pdf`
    let invoicePath = null
    const { data: storageData, error: storageErr } = await supabase.storage
      .from('invoices')
      .upload(invoiceFilename, pdfBuffer, { contentType: 'application/pdf', upsert: true })

    if (storageErr) {
      console.error('Storage upload error:', storageErr.message)
    } else {
      invoicePath = storageData.path
    }

    // Vlož řádky do DB
    const isCompany = customerType === 'firma'

    const rows = items.map(({ car, qty }) => {
      const lineOriginal = car.salePrice * qty
      const lineDiscount = totalBase > 0
        ? Math.round(totalDiscount * lineOriginal / totalBase)
        : 0
      const lineFinal = lineOriginal - lineDiscount

      const discountCodeLabel =
        discount?.code ||
        (manualDiscount?.label ? manualDiscount.label : null)

      return {
        email:           form.email,
        first_name:      isCompany ? null : form.firstName || null,
        last_name:       isCompany ? null : form.lastName || null,
        company_name:    isCompany ? form.companyName || null : null,
        ico:             isCompany ? form.ico || null : null,
        dic:             isCompany ? form.dic || null : null,
        contact_person:  isCompany ? form.contactPerson || null : null,
        phone:           form.phone || null,
        street:          form.street || null,
        city:            form.city || null,
        zip:             form.zip || null,
        customer_type:   customerType,
        notes:           form.notes || null,
        order_number:    orderNumber,
        payment_method:  paymentMethod,
        delivery:        form.delivery || false,
        discount_code:   discountCodeLabel,
        discount_amount: lineDiscount,
        charity:         charity || null,
        car_name:        car.name || '',
        car_slug:        car.slug || null,
        car_variant:     car.variant || null,
        car_color:       car.color || null,
        internal_id:     car.internalId || null,
        qty,
        is_used:         car.isUsed || !!car.mileage || false,
        price:           lineOriginal,
        price_original:  lineOriginal,
        price_final:     lineFinal,
        deposit_paid:    Math.round(lineOriginal * PROFORMA_DEPOSIT_PCT), // z ceny před slevou
        status:          status || 'prijato',
        is_new:          true,
        acknowledged:    true,
        invoice_path:    invoicePath,
      }
    })

    const { error: dbErr } = await supabase.from('orders').insert(rows)
    if (dbErr) return res.status(500).json({ error: dbErr.message })

    return res.status(200).json({ success: true, orderNumber, invoicePath })
  } catch (err) {
    console.error('ADMIN CREATE ORDER ERROR:', err)
    return res.status(500).json({ error: err.message })
  }
}
