import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const GREEN = '#1e7e34'
const DARK  = '#1a1a1a'
const GRAY  = '#6b7280'
const LGRAY = '#f5f5f5'
const MGRAY = '#e5e7eb'
const BLACK = '#111827'

const PROFORMA_DEPOSIT = 200000

const SELLER = {
  name:    'TOP GLOBAL STRATEGIC MANAGEMENT LTD',
  reg:     '490247',
  address: 'Gladstonos 83, 3032',
  city:    'Limassol, Kypr',
}

const BANK = {
  account:      'LT51 3250 0426 4014 3306',
  swift:        'REVOLT21',
  owner:        'TGSM',
  ownerAddress: 'Náměstí Republiky 1081/7, Praha 1, Česká Republika',
}

function czk(amount) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency', currency: 'CZK', maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('cs-CZ', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export async function generateInvoicePDF({ form, items, orderNumber, logoBase64, variableSymbol }) {
  return new Promise((resolve, reject) => {
    const fontRegular = path.join(__dirname, 'fonts', 'Calibri-Regular.ttf')
    const fontBold    = path.join(__dirname, 'fonts', 'Calibri-Bold.ttf')

    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
      info: { Title: `Proforma faktura ${orderNumber}` },
    })

    const chunks = []
    doc.on('data', c => chunks.push(c))
    doc.on('end',  () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    doc.registerFont('Regular', fontRegular)
    doc.registerFont('Bold',    fontBold)

    const ML  = 40
    const MR  = 55
    const PW  = 595
    const PH  = 842
    const CW  = PW - ML - MR   // 500

    const issueDate = new Date()
    const dueDate   = addDays(issueDate, 3)
    const vs        = variableSymbol || orderNumber

    const isCompany = !!form.companyName
    const buyerName = isCompany ? form.companyName : `${form.firstName} ${form.lastName}`

    const totalQty = items.reduce((sum, { qty }) => sum + qty, 0)
    const PROFORMA_AMOUNT = PROFORMA_DEPOSIT * totalQty

    const carItems = items.map(({ car, qty }) => ({
      name:       `${car.name} ${car.variant}`,
      internalId: car.internalId || null,
      qty,
      total: car.salePrice * qty,
    }))

    const freeItems = [
      'Prodloužená záruka 3 roky / 150 000 km',
      'Doprava',
      'Zápis do registru motorových vozidel',
    ]

    let y = 0

    // ── helpers ──────────────────────────────────────────────────────────────
    function R(size, color = BLACK) { doc.font('Regular').fontSize(size).fillColor(color); return doc }
    function B(size, color = BLACK) { doc.font('Bold').fontSize(size).fillColor(color);    return doc }
    function hline(yy, x1 = ML, x2 = PW - MR, color = MGRAY, w = 0.5) {
      doc.moveTo(x1, yy).lineTo(x2, yy).lineWidth(w).strokeColor(color).stroke()
    }
    function rect(x, yy, w, h, color) { doc.rect(x, yy, w, h).fill(color) }
    function roundRect(x, yy, w, h, r, color) { doc.roundedRect(x, yy, w, h, r).fill(color) }

    // ── GREEN HEADER BAR ─────────────────────────────────────────────────────
    rect(0, 0, PW, 6, GREEN)
    y = 6

    // ── LOGO + TITLE ─────────────────────────────────────────────────────────
    y += 22
    if (logoBase64) {
      const logoBuf = Buffer.from(logoBase64, 'base64')
      doc.image(logoBuf, ML, y, { fit: [130, 30] })
    } else {
      B(13, GREEN).text('Nejlevnější-Škoda.cz', ML, y + 8)
    }

    const titleX = ML + Math.floor(CW / 2)
    const titleW = PW - MR - titleX
    B(15, DARK).text(`Proforma faktura č. ${orderNumber}`, titleX, y + 4, { align: 'right', width: titleW, lineBreak: false })
    R(8.5, '#dc6803').text('Není daňovým dokladem', titleX, y + 24, { align: 'right', width: titleW, lineBreak: false })

    y += 60
    hline(y, 0, PW, GREEN, 1)
    y += 20

    // ── DODAVATEL / ODBĚRATEL ─────────────────────────────────────────────────
    const colW  = Math.floor(CW / 2) - 10
    const col2X = ML + colW + 20

    B(7.5, GREEN).text('Dodavatel:', ML, y)
    B(7.5, GREEN).text('Odběratel:', col2X, y)
    y += 14

    B(9.5, DARK).text(SELLER.name, ML, y, { width: colW })
    y += 13
    R(9, GRAY).text(SELLER.address, ML, y, { width: colW })
    y += 12
    R(9, GRAY).text(SELLER.city, ML, y, { width: colW })
    y += 12
    R(9, GRAY).text(`Reg. číslo: ${SELLER.reg}`, ML, y, { width: colW })

    const sellerEndY = y + 12

    let byY = y - 37
    B(9.5, DARK).text(buyerName, col2X, byY, { width: colW })
    byY += 13
    R(9, GRAY).text(form.street, col2X, byY, { width: colW })
    byY += 12
    R(9, GRAY).text(`${form.zip} ${form.city}`, col2X, byY, { width: colW })
    byY += 12
    if (isCompany && form.ico) { R(9, GRAY).text(`IČO: ${form.ico}`, col2X, byY, { width: colW }); byY += 12 }
    if (isCompany && form.dic) { R(9, GRAY).text(`DIČ: ${form.dic}`, col2X, byY, { width: colW }); byY += 12 }
    R(9, GRAY).text(form.email, col2X, byY, { width: colW })
    byY += 12
    R(9, GRAY).text(form.phone, col2X, byY, { width: colW })

    y = Math.max(sellerEndY, byY) + 20
    hline(y, ML, PW - MR)
    y += 16

    // Datum vystavení pouze (bez zdanitelného plnění)
    R(8, GRAY).text('Datum vystavení:  ', ML, y, { continued: true })
    B(8, DARK).text(formatDate(issueDate))
    y += 24

    // ── PAYMENT STRIP (3 boxes) ───────────────────────────────────────────────
    const stripH = 42
    const boxW   = Math.floor(CW / 3)

    for (let i = 0; i < 3; i++) {
      const bx = ML + i * boxW
      doc.roundedRect(bx, y, boxW, stripH, 3).lineWidth(0.8).strokeColor(MGRAY).fillAndStroke(LGRAY, MGRAY)
    }

    const boxes = [
      { label: 'Číslo účtu:',        value: BANK.account },
      { label: 'Datum splatnosti:',  value: formatDate(dueDate) },
      { label: 'Variabilní symbol:', value: vs },
    ]
    boxes.forEach((b, i) => {
      const bx = ML + i * boxW + 10
      R(7.5, GRAY).text(b.label, bx, y + 8,  { width: boxW - 20 })
      B(10.5, DARK).text(b.value, bx, y + 20, { width: boxW - 20 })
    })

    y += stripH + 22

    // ── ITEMS TABLE (bez DPH sloupců) ─────────────────────────────────────────
    const cDesc  = 330
    const cQty   = 35
    const cPrice = CW - cDesc - cQty   // ~135
    const xQty   = ML + cDesc
    const xPrice = xQty + cQty

    const RPAD    = 12
    const pRight  = PW - MR - RPAD
    const pWeff   = pRight - xPrice

    // Table header
    const thH = 24
    roundRect(ML, y, CW, thH, 3, DARK)
    doc.font('Bold').fontSize(8).fillColor('#ffffff')
    doc.text('Popis položky',  ML + 8, y + 8, { width: cDesc - 8,  lineBreak: false })
    doc.text('Ks',             xQty,   y + 8, { width: cQty,       align: 'center', lineBreak: false })
    doc.text('Cena vč. DPH',  xPrice, y + 8, { width: pWeff,      align: 'right',  lineBreak: false })
    y += thH

    function drawRow(name, sub, qty, price, bg) {
      const rowH = sub ? 29 : 22
      if (bg) rect(ML, y, CW, rowH, bg)
      hline(y + rowH, ML, PW - MR, MGRAY, 0.4)

      R(9, DARK).text(name, ML + 8, y + (sub ? 6 : 7), { width: cDesc - 16, lineBreak: false })
      if (sub) R(7.5, GRAY).text(sub, ML + 8, y + 18,  { width: cDesc - 16, lineBreak: false })

      R(9, DARK).text(String(qty), xQty, y + (sub ? 10 : 7), { width: cQty, align: 'center', lineBreak: false })

      if (price > 0) {
        B(9, GREEN).text(czk(price), xPrice, y + (sub ? 10 : 7), { width: pWeff, align: 'right', lineBreak: false })
      } else {
        R(9, GRAY).text('ZDARMA', xPrice, y + (sub ? 10 : 7), { width: pWeff, align: 'right', lineBreak: false })
      }

      y += rowH
    }

    carItems.forEach((item, i) => {
      const sub = item.internalId
        ? `Nový osobní automobil · ${item.internalId}`
        : 'Nový osobní automobil'
      drawRow(item.name, sub, item.qty, item.total, i % 2 ? LGRAY : null)
    })
    freeItems.forEach(name => {
      drawRow(name, null, totalQty, 0, '#f0faf2')
    })

    y += 18

    // ── PŘEDMĚT PLNĚNÍ ────────────────────────────────────────────────────────
    const predmetH = 56
    doc.roundedRect(ML, y, CW, predmetH, 4).lineWidth(1).strokeColor(GREEN).fillAndStroke('#f0faf2', GREEN)

    B(8, GREEN).text('PŘEDMĚT PLNĚNÍ:', ML + 14, y + 10, { lineBreak: false })
    R(9, DARK).text('Záloha na vozidlo dle výše uvedené objednávky', ML + 14, y + 24, { width: CW - 180, lineBreak: false })
    B(13, DARK).text(czk(PROFORMA_AMOUNT), ML + 14, y + 22, { width: CW - 28, align: 'right', lineBreak: false })

    y += predmetH + 16

    // ── CELKEM K ÚHRADĚ ───────────────────────────────────────────────────────
    const totW    = 240
    const totX    = PW - MR - totW
    const lblW    = 130
    const totX2   = totX + lblW
    const valWeff = PW - MR - RPAD - totX2

    const fboxH = 34
    roundRect(totX - 5, y, (PW - MR) - (totX - 5), fboxH, 4, GREEN)
    B(10, '#ffffff').text('Celkem k úhradě:', totX, y + 11, { width: lblW, lineBreak: false })
    B(12, '#ffffff').text(czk(PROFORMA_AMOUNT), totX2, y + 10, { width: valWeff, align: 'right', lineBreak: false })

    y += fboxH + 20

    // ── PLATEBNÍ ÚDAJE ────────────────────────────────────────────────────────
    const payH = 104
    doc.roundedRect(ML, y, CW, payH, 4).lineWidth(0.8).strokeColor('#c6e6cc').fillAndStroke('#f0faf2', '#c6e6cc')

    B(9, GREEN).text('Platební údaje', ML + 12, y + 10)

    const payData = [
      ['IBAN:',               BANK.account],
      ['SWIFT/BIC:',          BANK.swift],
      ['Variabilní symbol:',  vs],
    ]
    const halfW = Math.floor(CW / 2) - 12
    payData.forEach((row, i) => {
      const col = i < 2 ? 0 : 1
      const px  = ML + 12 + col * (halfW + 12)
      const py  = y + 22 + (i % 2) * 16
      R(8, GRAY).text(row[0], px, py, { width: 90, lineBreak: false })
      B(8, DARK).text(row[1], px + 92, py, { width: halfW - 92, lineBreak: false })
    })

    // Doplňující údaje pro banky které je vyžadují
    const noteY = y + 62
    doc.moveTo(ML + 12, noteY - 6).lineTo(ML + CW - 12, noteY - 6).lineWidth(0.5).strokeColor('#c6e6cc').stroke()
    R(7, GRAY).text(
      'Dodatečné údaje vyžadované některými bankami:',
      ML + 12, noteY, { width: CW - 24, lineBreak: false }
    )
    R(7.5, DARK).text(
      `Majitel účtu: ${BANK.owner}  ·  Adresa: ${BANK.ownerAddress}`,
      ML + 12, noteY + 11, { width: CW - 24, lineBreak: false }
    )

    y += payH + 18

    // ── PRÁVNÍ TEXTY ─────────────────────────────────────────────────────────
    const legalH = 54
    doc.roundedRect(ML, y, CW, legalH, 4).lineWidth(0.5).strokeColor(MGRAY).fillAndStroke('#fffbeb', MGRAY)

    R(7.5, '#92400e').text(
      'Tato proforma faktura není daňovým dokladem. DPH bude vyčísleno na daňovém dokladu (faktuře) vystavené při dodání zboží.',
      ML + 12, y + 10, { width: CW - 24, lineBreak: true }
    )
    R(7.5, GRAY).text(
      `Společnost ${SELLER.name}, se sídlem v Kyperské republice, je registrována k dani z přidané hodnoty v České republice dle příslušných právních předpisů.`,
      ML + 12, y + 32, { width: CW - 24, lineBreak: false }
    )

    y += legalH + 10

    // ── FOOTER ───────────────────────────────────────────────────────────────
    const footY = PH - 28
    hline(footY, ML, PW - MR, MGRAY, 0.5)
    R(7.5, GRAY).text(
      `${SELLER.name}  ·  Reg. číslo: ${SELLER.reg}  ·  ${SELLER.address}, ${SELLER.city}`,
      ML, footY + 6, { width: CW - 60, lineBreak: false }
    )
    R(7.5, GRAY).text('nejlevnejsi-skoda.cz', 0, footY + 6, { width: PW - MR, align: 'right', lineBreak: false })

    doc.end()
  })
}
