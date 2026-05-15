import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM         = 'platby@nejlevnejsi-skoda.cz'
const NOTIFY_EMAIL = 'info@nejlevnejsi-skoda.cz'

function notificationHtml(email) {
  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr><td style="background:#0891b2;border-radius:12px 12px 0 0;padding:24px 40px;">
          <div style="color:#cffafe;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">☀️ Akce léto — nová žádost o kód</div>
          <div style="color:#ffffff;font-size:20px;font-weight:900;">Škoda na dovolenou</div>
        </td></tr>

        <tr><td style="background:#ffffff;padding:32px 40px;border-radius:0 0 12px 12px;">
          <p style="margin:0 0 20px;font-size:15px;color:#374151;">
            Zákazník si vyžádal slevový kód <strong style="color:#0891b2;">−10 000 Kč</strong> v rámci akce <strong>Škoda na dovolenou</strong>.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
            <tr>
              <td style="color:#6b7280;font-size:13px;width:120px;">E-mail zákazníka:</td>
              <td style="font-size:14px;font-weight:700;color:#0891b2;">
                <a href="mailto:${email}" style="color:#0891b2;text-decoration:none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="color:#6b7280;font-size:13px;padding-top:8px;">Datum žádosti:</td>
              <td style="font-size:13px;color:#374151;padding-top:8px;">${new Date().toLocaleString('cs-CZ')}</td>
            </tr>
          </table>
          <p style="margin:0;color:#6b7280;font-size:13px;">
            Odešlete zákazníkovi slevový kód <strong>LETO10</strong> na e-mail výše.
          </p>
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

function confirmationHtml() {
  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr><td style="background:linear-gradient(135deg,#071828,#0b3a50);border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
          <div style="color:#67e8f9;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">☀️ Škoda na dovolenou</div>
          <div style="color:#ffffff;font-size:26px;font-weight:900;margin-bottom:4px;">Váš kód je na cestě!</div>
          <div style="color:#94a3b8;font-size:14px;">Nejlevnější-Škoda.cz</div>
        </td></tr>

        <tr><td style="background:#ffffff;padding:40px;">
          <p style="margin:0 0 20px;font-size:16px;color:#374151;line-height:1.6;">
            Dobrý den,<br><br>
            děkujeme za zájem o naši akci <strong style="color:#0891b2;">Škoda na dovolenou</strong>.
            Váš slevový kód Vám pošleme co nejdříve na tento e-mail.
          </p>

          <div style="background:#f0f9ff;border:2px solid #bae6fd;border-radius:10px;padding:20px 24px;margin-bottom:28px;text-align:center;">
            <div style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Váš slevový kód</div>
            <div style="color:#0891b2;font-size:28px;font-weight:900;letter-spacing:4px;">LETO10</div>
            <div style="color:#6b7280;font-size:12px;margin-top:6px;">Sleva −10 000 Kč na první objednávku</div>
          </div>

          <p style="margin:0 0 8px;font-size:14px;color:#374151;">Kód platí:</p>
          <ul style="margin:0 0 24px;padding-left:20px;color:#6b7280;font-size:13px;line-height:2;">
            <li>Na první objednávku nového vozu</li>
            <li>30 dní od doručení tohoto e-mailu</li>
            <li>Nelze kombinovat s jinými slevami</li>
          </ul>

          <a href="https://nejlevnejsi-skoda.cz/vozy" style="display:inline-block;background:#1e7e34;color:#ffffff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:8px;text-decoration:none;">
            Prohlédnout vozy →
          </a>
        </td></tr>

        <tr><td style="background:#f9fafb;border:1px solid #f0f0f0;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;">
          <p style="margin:0 0 4px;font-weight:700;color:#111827;font-size:13px;">Otázky? Jsme tu pro Vás.</p>
          <p style="margin:0;color:#6b7280;font-size:12px;">
            <a href="tel:+420733455966" style="color:#1e7e34;text-decoration:none;">+420 733 455 966</a>
            &nbsp;·&nbsp;
            <a href="mailto:info@nejlevnejsi-skoda.cz" style="color:#1e7e34;text-decoration:none;">info@nejlevnejsi-skoda.cz</a>
          </p>
          <p style="margin:12px 0 0;color:#9ca3af;font-size:11px;">© ${new Date().getFullYear()} Nejlevnejsi-Skoda.cz · Všechna práva vyhrazena</p>
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

  const { email } = req.body

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Zadejte platný e-mail.' })
  }

  try {
    // Notifikace na info@ — někdo chce kód
    await resend.emails.send({
      from: `Nejlevnější Škoda CZ <${FROM}>`,
      to: NOTIFY_EMAIL,
      subject: `☀️ Akce léto — nová žádost o kód od ${email}`,
      html: notificationHtml(email),
    })

    // Potvrzovací e-mail zákazníkovi s kódem
    await resend.emails.send({
      from: `Nejlevnější Škoda CZ <${FROM}>`,
      to: email,
      subject: 'Váš slevový kód −10 000 Kč — Škoda na dovolenou',
      html: confirmationHtml(),
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('AKCE-DOVOLENA ERROR:', err)
    return res.status(500).json({ message: 'Nepodařilo se odeslat e-mail. Zkuste to prosím znovu.' })
  }
}
