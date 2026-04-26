import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'platby@nejlevnejsi-skoda.cz'
const CLIENT_EMAIL = 'info@nejlevnejsi-skoda.cz'

function formatPrice(price) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(price)
}

function generateOrderNumber() {
  const date = new Date()
  const year = date.getFullYear()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `OBJ-${year}-${rand}`
}

function customerEmail(form, items, total, orderNumber) {
  const isCompany = !!form.companyName
  const name = isCompany ? form.companyName : `${form.firstName} ${form.lastName}`

  const itemsRows = items.map(({ car, qty }) => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#111827;">${car.name} ${car.variant}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;text-align:center;color:#6b7280;">${qty}×</td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:700;color:#1e7e34;">${formatPrice(car.salePrice * qty)}</td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#0d1f10;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
          <div style="color:#28a745;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Potvrzení objednávky</div>
          <div style="color:#ffffff;font-size:28px;font-weight:900;margin-bottom:4px;">Nejlevnější-Škoda.cz</div>
          <div style="color:#6b7280;font-size:14px;">Vozy z EU levněji než v ČR</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:40px;">

          <p style="margin:0 0 8px;font-size:22px;font-weight:900;color:#111827;">Dobrý den, ${name},</p>
          <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
            děkujeme za Vaši objednávku. Přijali jsme ji a brzy Vás budeme kontaktovat s dalšími informacemi a platebními údaji.
          </p>

          <!-- Order number -->
          <div style="background:#f0faf2;border:1px solid #d4edda;border-radius:8px;padding:16px 20px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;">
            <span style="color:#6b7280;font-size:13px;">Číslo objednávky</span>
            <span style="color:#1e7e34;font-size:16px;font-weight:900;">${orderNumber}</span>
          </div>

          <!-- Items -->
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#111827;text-transform:uppercase;letter-spacing:1px;">Objednané vozy</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:8px;overflow:hidden;margin-bottom:28px;">
            <thead>
              <tr style="background:#f9fafb;">
                <th style="padding:10px 16px;text-align:left;font-size:12px;color:#9ca3af;font-weight:600;">Vůz</th>
                <th style="padding:10px 16px;text-align:center;font-size:12px;color:#9ca3af;font-weight:600;">Ks</th>
                <th style="padding:10px 16px;text-align:right;font-size:12px;color:#9ca3af;font-weight:600;">Cena</th>
              </tr>
            </thead>
            <tbody>${itemsRows}</tbody>
            <tfoot>
              <tr style="background:#f9fafb;">
                <td colspan="2" style="padding:14px 16px;font-weight:700;color:#111827;">Celkem vč. DPH</td>
                <td style="padding:14px 16px;text-align:right;font-size:18px;font-weight:900;color:#1e7e34;">${formatPrice(total)}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Info box -->
          <div style="background:#fff8e1;border:1px solid #ffd54f;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
            <p style="margin:0 0 6px;font-weight:700;color:#92400e;font-size:14px;">Faktura v příloze</p>
            <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">
              Fakturu s platebními údaji a variabilním symbolem najdete v příloze tohoto emailu. Prosím proveďte platbu do data splatnosti uvedeného na faktuře.
            </p>
          </div>

          <!-- Next steps -->
          <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#111827;text-transform:uppercase;letter-spacing:1px;">Co se děje dál?</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${['Fakturu najdete v příloze tohoto emailu', 'Proveďte platbu dle pokynů na faktuře', 'Po přijetí platby zajistíme objednávku u evropského dealera', 'Vůz dovezeme až k Vám domů'].map((step, i) => `
            <tr>
              <td style="padding:8px 0;vertical-align:top;">
                <span style="display:inline-block;width:24px;height:24px;background:#1e7e34;color:#fff;border-radius:50%;font-size:12px;font-weight:700;text-align:center;line-height:24px;margin-right:12px;">${i + 1}</span>
              </td>
              <td style="padding:8px 0;color:#374151;font-size:14px;line-height:1.5;">${step}</td>
            </tr>`).join('')}
          </table>

        </td></tr>

        <!-- Contact -->
        <tr><td style="background:#f9fafb;border:1px solid #f0f0f0;border-radius:0 0 12px 12px;padding:28px 40px;text-align:center;">
          <p style="margin:0 0 4px;font-weight:700;color:#111827;font-size:14px;">Máte otázky?</p>
          <p style="margin:0;color:#6b7280;font-size:13px;">
            <a href="tel:+420733455966" style="color:#1e7e34;text-decoration:none;">+420 733 455 966</a>
            &nbsp;·&nbsp;
            <a href="mailto:info@nejlevnejsi-skoda.cz" style="color:#1e7e34;text-decoration:none;">info@nejlevnejsi-skoda.cz</a>
          </p>
          <p style="margin:16px 0 0;color:#9ca3af;font-size:11px;">© ${new Date().getFullYear()} Nejlevnejsi-Skoda.cz · Všechna práva vyhrazena</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function clientNotificationEmail(form, items, total, orderNumber) {
  const isCompany = !!form.companyName
  const name = isCompany ? form.companyName : `${form.firstName} ${form.lastName}`
  const contactPerson = isCompany ? form.contactPerson : `${form.firstName} ${form.lastName}`

  const itemsList = items.map(({ car, qty }) =>
    `• ${car.name} ${car.variant} — ${qty}× — ${formatPrice(car.salePrice * qty)}`
  ).join('\n')

  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr><td style="background:#1e7e34;border-radius:12px 12px 0 0;padding:24px 40px;">
          <div style="color:#ffffff;font-size:20px;font-weight:900;">🛒 Nová objednávka</div>
          <div style="color:#d4edda;font-size:13px;margin-top:4px;">${orderNumber}</div>
        </td></tr>

        <tr><td style="background:#ffffff;padding:32px 40px;border-radius:0 0 12px 12px;">

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td colspan="2" style="padding-bottom:12px;font-weight:700;color:#111827;border-bottom:2px solid #f0f0f0;margin-bottom:12px;">Zákazník</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:140px;">Typ</td><td style="padding:6px 0;font-size:13px;font-weight:600;">${isCompany ? 'Firma' : 'Fyzická osoba'}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Jméno / Firma</td><td style="padding:6px 0;font-size:13px;font-weight:600;">${name}</td></tr>
            ${isCompany ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Kontaktní osoba</td><td style="padding:6px 0;font-size:13px;">${contactPerson || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">IČO</td><td style="padding:6px 0;font-size:13px;">${form.ico}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">DIČ</td><td style="padding:6px 0;font-size:13px;">${form.dic || '—'}</td></tr>` : ''}
            <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">E-mail</td><td style="padding:6px 0;font-size:13px;"><a href="mailto:${form.email}" style="color:#1e7e34;">${form.email}</a></td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Telefon</td><td style="padding:6px 0;font-size:13px;"><a href="tel:${form.phone}" style="color:#1e7e34;">${form.phone}</a></td></tr>
            <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Adresa</td><td style="padding:6px 0;font-size:13px;">${form.street}, ${form.zip} ${form.city}</td></tr>
            ${form.note ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Poznámka</td><td style="padding:6px 0;font-size:13px;">${form.note}</td></tr>` : ''}
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td colspan="2" style="padding-bottom:12px;font-weight:700;color:#111827;border-bottom:2px solid #f0f0f0;">Vozy</td></tr>
            ${items.map(({ car, qty }) => `
            <tr>
              <td style="padding:8px 0;font-size:13px;color:#374151;">${car.name} ${car.variant} <span style="color:#9ca3af;">(${qty}×)</span></td>
              <td style="padding:8px 0;font-size:13px;font-weight:700;color:#1e7e34;text-align:right;">${formatPrice(car.salePrice * qty)}</td>
            </tr>`).join('')}
            <tr>
              <td style="padding:12px 0 0;font-weight:900;font-size:15px;border-top:2px solid #f0f0f0;">Celkem</td>
              <td style="padding:12px 0 0;font-weight:900;font-size:15px;color:#1e7e34;text-align:right;border-top:2px solid #f0f0f0;">${formatPrice(total)}</td>
            </tr>
          </table>

        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { form, items, total } = req.body

  if (!form || !items || !total) {
    return res.status(400).json({ error: 'Missing data' })
  }

  const orderNumber = generateOrderNumber()

  try {
    // Email zákazníkovi
    await resend.emails.send({
      from: `Nejlevnější Škoda <${FROM}>`,
      to: form.email,
      subject: `Potvrzení objednávky ${orderNumber} — Nejlevnější-Škoda.cz`,
      html: customerEmail(form, items, total, orderNumber),
    })

    // Notifikace klientovi
    await resend.emails.send({
      from: `Nejlevnější Škoda <${FROM}>`,
      to: CLIENT_EMAIL,
      subject: `Nová objednávka ${orderNumber} — ${form.companyName || `${form.firstName} ${form.lastName}`}`,
      html: clientNotificationEmail(form, items, total, orderNumber),
    })

    return res.status(200).json({ success: true, orderNumber })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Email se nepodařilo odeslat' })
  }
}
