import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM          = 'info@nejlevnejsi-skoda.cz'
const CONTACT_EMAIL = 'info@nejlevnejsi-skoda.cz'

function contactEmail(form, attachmentCount) {
  const rows = [
    ['Jméno', form.name],
    ['E-mail', `<a href="mailto:${form.email}" style="color:#1e7e34;">${form.email}</a>`],
    form.phone ? ['Telefon', `<a href="tel:${form.phone}" style="color:#1e7e34;">${form.phone}</a>`] : null,
    form.model ? ['Zájem o model', form.model] : null,
    ['Zpráva', `<span style="white-space:pre-line;">${form.message}</span>`],
    attachmentCount > 0
      ? ['Přílohy', `<strong style="color:#1e7e34;">${attachmentCount} soubor${attachmentCount === 1 ? '' : attachmentCount < 5 ? 'y' : 'ů'}</strong>`]
      : null,
  ]
    .filter(Boolean)
    .map(([label, val]) => `
      <tr>
        <td style="padding:7px 0;color:#6b7280;font-size:13px;width:150px;vertical-align:top;">${label}</td>
        <td style="padding:7px 0;font-size:13px;color:#111827;">${val}</td>
      </tr>`)
    .join('')

  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr><td style="background:#0d1f10;border-radius:12px 12px 0 0;padding:24px 40px;">
          <div style="color:#28a745;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Nová poptávka</div>
          <div style="color:#ffffff;font-size:20px;font-weight:900;">Nejlevnější-Škoda.cz</div>
        </td></tr>

        <tr><td style="background:#ffffff;padding:32px 40px;border-radius:0 0 12px 12px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td colspan="2" style="padding-bottom:14px;font-weight:700;color:#111827;font-size:15px;border-bottom:2px solid #f0f0f0;margin-bottom:12px;">Detail poptávky</td></tr>
            ${rows}
          </table>
        </td></tr>

        <tr><td style="padding:20px 40px;text-align:center;">
          <p style="margin:0;color:#9ca3af;font-size:11px;">© ${new Date().getFullYear()} Nejlevnejsi-Skoda.cz</p>
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

  const { form, fileAttachments = [] } = req.body

  if (!form?.name || !form?.email || !form?.message) {
    return res.status(400).json({ error: 'Chybí povinná pole' })
  }

  try {
    const customerFiles = fileAttachments.map(f => ({
      filename: f.name,
      content: f.data,
    }))

    await resend.emails.send({
      from: `Nejlevnější Škoda <${FROM}>`,
      to: CONTACT_EMAIL,
      replyTo: form.email,
      subject: `Nová poptávka od ${form.name}${form.model ? ` — ${form.model}` : ''}`,
      html: contactEmail(form, customerFiles.length),
      attachments: customerFiles,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('CONTACT ERROR:', err)
    return res.status(500).json({ error: 'Email se nepodařilo odeslat', detail: err.message })
  }
}
