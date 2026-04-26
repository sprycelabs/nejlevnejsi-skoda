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

const SELLER = {
  name:    'TOP GLOBAL STRATEGIC MANAGEMENT LTD',
  reg:     '490247',
  address: 'Gladstonos 83, 3032',
  city:    'Limassol, Kypr',
}

const BANK = {
  account: 'CZ00 0000 0000 0000 0000 0000',
  swift:   'XXXXXXXX',
  bank:    'Banka',
}

const VAT_RATE = 0.21

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

export async function generateInvoicePDF({ form, items, total, orderNumber, logoBase64 }) {
  return new Promise((resolve, reject) => {
    const fontRegular = path.join(__dirname, 'fonts', 'Calibri-Regular.ttf')
    const fontBold    = path.join(__dirname, 'fonts', 'Calibri-Bold.ttf')

    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
      info: { Title: `Faktura ${orderNumber}` },
    })

    const chunks = []
    doc.on('data', c => chunks.push(c))
    doc.on('end',  () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    doc.registerFont('Regular', fontRegular)
    doc.registerFont('Bold',    fontBold)

    const ML  = 40   // margin left
    const MR  = 55   // margin right
    const PW  = 595  // page width
    const PH  = 842  // page height
    const CW  = PW - ML - MR  // content width = 507

    const issueDate = new Date()
    const dueDate   = addDays(issueDate, 3)

    const isCompany  = !!form.companyName
    const buyerName  = isCompany ? form.companyName : `${form.firstName} ${form.lastName}`

    const carItems = items.map(({ car, qty }) => {
      const lineTotal = car.salePrice * qty
      const base      = Math.round(lineTotal / (1 + VAT_RATE))
      const vat       = lineTotal - base
      return { name: `${car.name} ${car.variant}`, qty, base, vat, total: lineTotal }
    })
    const totalBase = carItems.reduce((s, i) => s + i.base, 0)
    const totalVat  = carItems.reduce((s, i) => s + i.vat,  0)

    const freeItems = [
      'Prodloužená záruka 3 roky / 150 000 km',
      'Doprava',
      'Zápis do registru motorových vozidel',
    ]

    let y = 0

    // ── helpers ──────────────────────────────────────────────────────────────
    function R(size, color = BLACK) {
      doc.font('Regular').fontSize(size).fillColor(color)
      return doc
    }
    function B(size, color = BLACK) {
      doc.font('Bold').fontSize(size).fillColor(color)
      return doc
    }
    function hline(yy, x1 = ML, x2 = PW - MR, color = MGRAY, w = 0.5) {
      doc.moveTo(x1, yy).lineTo(x2, yy).lineWidth(w).strokeColor(color).stroke()
    }
    function vline(x, y1, y2, color = MGRAY, w = 0.5) {
      doc.moveTo(x, y1).lineTo(x, y2).lineWidth(w).strokeColor(color).stroke()
    }
    function rect(x, yy, w, h, color) {
      doc.rect(x, yy, w, h).fill(color)
    }
    function roundRect(x, yy, w, h, r, color) {
      doc.roundedRect(x, yy, w, h, r).fill(color)
    }

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

    // "Faktura č." right side — v pravé polovině stránky
    const titleX = ML + Math.floor(CW / 2)
    const titleW = PW - MR - titleX
    B(17, DARK).text(`Faktura č. ${orderNumber}`, titleX, y + 4, { align: 'right', width: titleW, lineBreak: false })
    R(8.5, GRAY).text('Daňový doklad', titleX, y + 24, { align: 'right', width: titleW, lineBreak: false })

    y += 60
    hline(y, 0, PW, GREEN, 1)
    y += 20

    // ── DODAVATEL / ODBĚRATEL ─────────────────────────────────────────────────
    const colW  = Math.floor(CW / 2) - 10
    const col2X = ML + colW + 20

    // Labels
    B(7.5, GREEN).text('Dodavatel:', ML, y)
    B(7.5, GREEN).text('Odběratel:', col2X, y)
    y += 14

    // Seller
    B(9.5, DARK).text(SELLER.name, ML, y, { width: colW })
    y += 13
    R(9, GRAY).text(SELLER.address, ML, y, { width: colW })
    y += 12
    R(9, GRAY).text(SELLER.city, ML, y, { width: colW })
    y += 12
    R(9, GRAY).text(`Reg. číslo: ${SELLER.reg}`, ML, y, { width: colW })

    const sellerEndY = y + 12

    // Buyer (same starting y as seller name)
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

    // Dates (right-aligned under seller)
    R(8, GRAY).text(`Datum vystavení:  `, ML, y, { continued: true })
    B(8, DARK).text(formatDate(issueDate))
    y += 13
    R(8, GRAY).text(`Datum zdan. plnění:  `, ML, y, { continued: true })
    B(8, DARK).text(formatDate(issueDate))

    y += 24

    // ── PAYMENT STRIP (3 boxes) ───────────────────────────────────────────────
    const stripH = 42
    const boxW   = Math.floor(CW / 3)

    // Draw 3 bordered boxes
    for (let i = 0; i < 3; i++) {
      const bx = ML + i * boxW
      doc.roundedRect(bx, y, boxW, stripH, 3).lineWidth(0.8).strokeColor(MGRAY).fillAndStroke(LGRAY, MGRAY)
    }

    // Content: Číslo účtu | Datum splatnosti | Variabilní symbol
    const boxes = [
      { label: 'Číslo účtu:', value: BANK.account },
      { label: 'Datum splatnosti:', value: formatDate(dueDate) },
      { label: 'Variabilní symbol:', value: orderNumber },
    ]
    boxes.forEach((b, i) => {
      const bx = ML + i * boxW + 10
      R(7.5, GRAY).text(b.label, bx, y + 8, { width: boxW - 20 })
      B(10.5, DARK).text(b.value, bx, y + 20, { width: boxW - 20 })
    })

    y += stripH + 22

    // ── ITEMS TABLE ───────────────────────────────────────────────────────────
    // Column layout
    const cDesc  = 205
    const cQty   = 28
    const cBase  = 88
    const cVat   = 66
    const cTotal = CW - cDesc - cQty - cBase - cVat  // ~132
    const xQty   = ML + cDesc
    const xBase  = xQty + cQty
    const xVat   = xBase + cBase
    const xTot   = xVat + cVat

    // Table header
    const thH = 24
    roundRect(ML, y, CW, thH, 3, DARK)
    doc.font('Bold').fontSize(8).fillColor('#ffffff')
    doc.text('Popis položky', ML + 8, y + 8, { width: cDesc - 8,   lineBreak: false })
    doc.text('Ks',            xQty,   y + 8, { width: cQty,        align: 'center', lineBreak: false })
    doc.text('Základ DPH',   xBase,  y + 8, { width: cBase - 4,  align: 'right',  lineBreak: false })
    doc.text('DPH 21%',      xVat,   y + 8, { width: cVat - 4,   align: 'right',  lineBreak: false })
    doc.text('Celkem s DPH', xTot,   y + 8, { width: cTotal - 8,  align: 'right',  lineBreak: false })
    y += thH

    function drawRow(name, sub, qty, base, vat, rowTotal, bg) {
      const rowH = sub ? 29 : 22
      if (bg) rect(ML, y, CW, rowH, bg)
      hline(y + rowH, ML, PW - MR, MGRAY, 0.4)

      R(9, DARK).text(name, ML + 8, y + (sub ? 6 : 7), { width: cDesc - 16, lineBreak: false })
      if (sub) R(7.5, GRAY).text(sub, ML + 8, y + 18, { width: cDesc - 16, lineBreak: false })

      R(9, DARK).text(String(qty),    xQty,  y + (sub ? 10 : 7), { width: cQty,       align: 'center', lineBreak: false })
      R(9, DARK).text(czk(base),      xBase, y + (sub ? 10 : 7), { width: cBase - 4,  align: 'right',  lineBreak: false })
      R(9, DARK).text(czk(vat),       xVat,  y + (sub ? 10 : 7), { width: cVat - 4,   align: 'right',  lineBreak: false })
      B(9, GREEN).text(czk(rowTotal), xTot,  y + (sub ? 10 : 7), { width: cTotal - 8, align: 'right',  lineBreak: false })

      y += rowH
    }

    carItems.forEach((item, i) => {
      drawRow(item.name, 'Nový osobní automobil', item.qty, item.base, item.vat, item.total, i % 2 ? LGRAY : null)
    })
    freeItems.forEach((name, i) => {
      drawRow(name, null, 1, 0, 0, 0, '#f0faf2')
    })

    y += 14

    // ── TOTALS ────────────────────────────────────────────────────────────────
    const totW   = 230
    const totX   = PW - MR - totW          // left edge of totals box
    const lblW   = 120                      // label column width
    const valW   = totW - lblW              // value column width = 110
    const totX2  = totX + lblW             // start of value column

    // right edge of totals = same as table (PW - MR)
    // values end 12px before that edge
    const RPAD     = 12
    const valRight = PW - MR - RPAD   // text right edge
    const valWeff  = valRight - totX2  // effective value width

    function totRow(label, value) {
      R(9, GRAY).text(label, totX,  y, { width: lblW, lineBreak: false })
      R(9, DARK).text(value, totX2, y, { width: valWeff, align: 'right', lineBreak: false })
      hline(y + 14, totX, PW - MR, MGRAY, 0.4)
      y += 16
    }

    totRow('Celkem bez DPH:', czk(totalBase))
    totRow('DPH 21%:',        czk(totalVat))
    y += 4

    // Final "Celkem k úhradě" box — same right edge as table
    const fboxH = 32
    roundRect(totX - 5, y, (PW - MR) - (totX - 5), fboxH, 4, GREEN)
    B(10, '#ffffff').text('Celkem k úhradě:', totX, y + 10, { width: lblW, lineBreak: false })
    B(11, '#ffffff').text(czk(total), totX2, y + 9, { width: valWeff, align: 'right', lineBreak: false })
    y += fboxH + 24

    // ── PAYMENT DETAILS ───────────────────────────────────────────────────────
    const payH = 72
    doc.roundedRect(ML, y, CW, payH, 4).lineWidth(0.8).strokeColor('#c6e6cc').fillAndStroke('#f0faf2', '#c6e6cc')

    B(9, GREEN).text('Platební údaje', ML + 12, y + 10)

    const payData = [
      ['IBAN:',               BANK.account],
      ['SWIFT/BIC:',          BANK.swift],
      ['Banka:',              BANK.bank],
      ['Variabilní symbol:',  orderNumber],
    ]
    const halfW = Math.floor(CW / 2) - 12
    payData.forEach((row, i) => {
      const col = i < 2 ? 0 : 1
      const px  = ML + 12 + col * (halfW + 12)
      const py  = y + 22 + (i % 2) * 16
      R(8, GRAY).text(row[0], px, py, { width: 90, lineBreak: false })
      B(8, DARK).text(row[1], px + 92, py, { width: halfW - 92, lineBreak: false })
    })

    y += payH + 20

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
