export const config = { matcher: '/' }

const BOTS = [
  'facebookexternalhit', 'Facebot', 'Twitterbot', 'WhatsApp',
  'LinkedInBot', 'Slackbot', 'TelegramBot', 'Googlebot',
]

const OG_HTML = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8" />
  <title>Vozy Škoda z EU levněji než v ČR | Ušetřete až 20 %</title>
  <meta name="description" content="Kupte novou Škodu z EU až o 20 % levněji než u českých dealerů. Tovární záruka zachována, dovoz do ČR zajištěn." />
  <meta property="og:type"        content="website" />
  <meta property="og:site_name"   content="Nejlevnější Škoda" />
  <meta property="og:url"         content="https://nejlevnejsi-skoda.cz/" />
  <meta property="og:title"       content="Vozy Škoda z EU levněji než v ČR | Ušetřete až 20 %" />
  <meta property="og:description" content="Kupte novou Škodu z EU až o 20 % levněji než u českých dealerů. Tovární záruka zachována, dovoz do ČR zajištěn." />
  <meta property="og:image"       content="https://nejlevnejsi-skoda.cz/og-image.png" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale"      content="cs_CZ" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="Vozy Škoda z EU levněji než v ČR | Ušetřete až 20 %" />
  <meta name="twitter:description" content="Kupte novou Škodu z EU až o 20 % levněji než u českých dealerů." />
  <meta name="twitter:image"       content="https://nejlevnejsi-skoda.cz/og-image.png" />
</head>
<body></body>
</html>`

export default function middleware(request) {
  const ua = request.headers.get('user-agent') || ''
  const isBot = BOTS.some(bot => ua.includes(bot))

  if (isBot) {
    return new Response(OG_HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}
