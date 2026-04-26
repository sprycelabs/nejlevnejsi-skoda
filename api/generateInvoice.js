import PDFDocument from 'pdfkit'

const GREEN  = '#1e7e34'
const DARK   = '#0d1f10'
const GRAY   = '#6b7280'
const LGRAY  = '#f3f4f6'
const BLACK  = '#111827'

const SELLER = {
  name:    'TOP GLOBAL STRATEGIC MANAGEMENT LTD',
  reg:     '490247',
  address: 'Gladstonos 83, 3032, Limassol, Kypr',
}

const BANK = {
  iban:  'CZ00 0000 0000 0000 0000 0000',
  swift: 'XXXXXXXX',
  bank:  'Placeholder Bank',
}

const VAT_RATE = 0.21

function formatCZK(amount) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency', currency: 'CZK', maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('cs-CZ', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function hex(color) {
  // pdfkit fillColor accepts hex strings directly
  return color
}

export async function generateInvoicePDF({ form, items, total, orderNumber, logoBase64 }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40, info: { Title: `Faktura ${orderNumber}` } })
    const chunks = []
    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const W = 515 // usable width (595 - 2*40)
    const isCompany = !!form.companyName
    const buyerName = isCompany ? form.companyName : `${form.firstName} ${form.lastName}`
    const issueDate = new Date()
    const dueDate   = addDays(issueDate, 3)

    const carItems = items.map(({ car, qty }) => {
      const lineTotal = car.salePrice * qty
      const base = Math.round(lineTotal / (1 + VAT_RATE))
      const vat  = lineTotal - base
      return { name: `${car.name} ${car.variant}`, qty, base, vat, total: lineTotal }
    })
    const totalBase = carItems.reduce((s, i) => s + i.base, 0)
    const totalVat  = carItems.reduce((s, i) => s + i.vat,  0)

    const freeItems = [
      'Prodloužená záruka 3 roky / 150 000 km',
      'Doprava',
      'Zápis do registru motorových vozidel',
    ]

    // ── HEADER ───────────────────────────────────────────────────────────────
    if (logoBase64) {
      const logoBuf = Buffer.from(logoBase64, 'base64')
      doc.image(logoBuf, 40, 40, { height: 36, fit: [160, 36] })
    } else {
      doc.fontSize(14).fillColor(GREEN).font('Helvetica-Bold').text('Nejlevnější-Škoda.cz', 40, 48)
    }

    // "FAKTURA" label top right
    doc.fontSize(24).fillColor(GREEN).font('Helvetica-Bold')
       .text('FAKTURA', 0, 40, { align: 'right' })
    doc.fontSize(10).fillColor(GRAY).font('Helvetica')
       .text(orderNumber, 0, 68, { align: 'right' })

    // Green divider
    doc.y = 88
    doc.moveTo(40, doc.y).lineTo(555, doc.y).lineWidth(2).strokeColor(GREEN).stroke()
    doc.y += 14

    // ── SELLER / BUYER columns ────────────────────────────────────────────────
    const colY = doc.y
    const colW = (W - 20) / 2

    // Prodávající
    doc.fontSize(7).fillColor(GREEN).font('Helvetica-Bold')
       .text('PRODÁVAJÍCÍ', 40, colY, { width: colW })
    doc.fontSize(9).fillColor(BLACK).font('Helvetica-Bold')
       .text(SELLER.name, 40, colY + 14, { width: colW })
    doc.fontSize(8).fillColor(GRAY).font('Helvetica')
       .text(`Reg. číslo: ${SELLER.reg}`, 40, doc.y + 2, { width: colW })
       .text(SELLER.address, 40, doc.y + 2, { width: colW })

    const sellerBottom = doc.y

    // Kupující
    doc.fontSize(7).fillColor(GREEN).font('Helvetica-Bold')
       .text('KUPUJÍCÍ', 40 + colW + 20, colY, { width: colW })
    doc.fontSize(9).fillColor(BLACK).font('Helvetica-Bold')
       .text(buyerName, 40 + colW + 20, colY + 14, { width: colW })
    doc.fontSize(8).fillColor(GRAY).font('Helvetica')
    if (isCompany && form.ico) doc.text(`IČO: ${form.ico}`, 40 + colW + 20, doc.y + 2, { width: colW })
    if (isCompany && form.dic) doc.text(`DIČ: ${form.dic}`, 40 + colW + 20, doc.y + 2, { width: colW })
    doc.text(form.street, 40 + colW + 20, doc.y + 2, { width: colW })
       .text(`${form.zip} ${form.city}`, 40 + colW + 20, doc.y + 2, { width: colW })
       .text(form.email, 40 + colW + 20, doc.y + 2, { width: colW })
       .text(form.phone, 40 + colW + 20, doc.y + 2, { width: colW })

    doc.y = Math.max(sellerBottom, doc.y) + 16

    // ── META STRIP ────────────────────────────────────────────────────────────
    const stripY = doc.y
    const stripH = 38
    doc.roundedRect(40, stripY, W, stripH, 4).fill(LGRAY)

    const metaCols = [
      { label: 'Datum vystavení', value: formatDate(issueDate) },
      { label: 'Datum splatnosti', value: formatDate(dueDate) },
      { label: 'Variabilní symbol', value: orderNumber },
      { label: 'Způsob platby', value: 'Bankovní převod' },
    ]
    const metaW = W / metaCols.length
    metaCols.forEach((m, i) => {
      const x = 40 + i * metaW
      doc.fontSize(7).fillColor(GRAY).font('Helvetica')
         .text(m.label.toUpperCase(), x + 6, stripY + 7, { width: metaW - 12, align: 'center' })
      doc.fontSize(9).fillColor(BLACK).font('Helvetica-Bold')
         .text(m.value, x + 6, stripY + 20, { width: metaW - 12, align: 'center' })
    })
    doc.y = stripY + stripH + 16

    // ── TABLE ─────────────────────────────────────────────────────────────────
    // Column widths
    const cDesc  = 220
    const cQty   = 30
    const cBase  = 80
    const cVat   = 60
    const cTotal = W - cDesc - cQty - cBase - cVat
    const xQty   = 40 + cDesc
    const xBase  = xQty + cQty
    const xVat   = xBase + cBase
    const xTotal = xVat + cVat

    // Header row
    const thY = doc.y
    doc.roundedRect(40, thY, W, 22, 3).fill(DARK)
    doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold')
    doc.text('Popis',           44,      thY + 7, { width: cDesc - 4 })
    doc.text('Ks',              xQty,    thY + 7, { width: cQty,  align: 'center' })
    doc.text('Základ DPH',      xBase,   thY + 7, { width: cBase, align: 'right' })
    doc.text('DPH 21%',         xVat,    thY + 7, { width: cVat,  align: 'right' })
    doc.text('Celkem vč. DPH',  xTotal,  thY + 7, { width: cTotal, align: 'right' })
    doc.y = thY + 22

    function tableRow(name, subtext, qty, base, vat, rowTotal, bgColor) {
      const rY = doc.y
      const rowH = subtext ? 28 : 20
      if (bgColor) doc.rect(40, rY, W, rowH).fill(bgColor)
      doc.moveTo(40, rY + rowH).lineTo(555, rY + rowH).lineWidth(0.5).strokeColor('#e5e7eb').stroke()

      doc.fontSize(9).fillColor(BLACK).font('Helvetica')
         .text(name, 44, rY + 6, { width: cDesc - 8 })
      if (subtext) {
        doc.fontSize(7).fillColor(GRAY)
           .text(subtext, 44, rY + 17, { width: cDesc - 8 })
      }
      doc.fontSize(9).fillColor(BLACK).font('Helvetica')
         .text(String(qty),       xQty,   rY + 6, { width: cQty,   align: 'center' })
         .text(formatCZK(base),   xBase,  rY + 6, { width: cBase,  align: 'right' })
         .text(formatCZK(vat),    xVat,   rY + 6, { width: cVat,   align: 'right' })
      doc.fillColor(GREEN).font('Helvetica-Bold')
         .text(formatCZK(rowTotal), xTotal, rY + 6, { width: cTotal, align: 'right' })
      doc.y = rY + rowH
    }

    carItems.forEach((item, i) => {
      tableRow(item.name, 'Nový osobní automobil', item.qty, item.base, item.vat, item.total, i % 2 === 1 ? '#f9fafb' : null)
    })
    freeItems.forEach(name => {
      tableRow(name, null, 1, 0, 0, 0, '#f0faf2')
    })

    doc.y += 10

    // ── TOTALS ────────────────────────────────────────────────────────────────
    const totW = 210
    const totX = 555 - totW

    function totRow(label, value, isFinal) {
      const rY = doc.y
      if (isFinal) {
        doc.roundedRect(totX, rY, totW, 26, 4).fill(GREEN)
        doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
           .text(label, totX + 8, rY + 8, { width: totW - 70 })
           .text(value, totX,     rY + 8, { width: totW - 8, align: 'right' })
        doc.y = rY + 26 + 4
      } else {
        doc.moveTo(totX, rY + 18).lineTo(555, rY + 18).lineWidth(0.5).strokeColor('#e5e7eb').stroke()
        doc.fontSize(9).fillColor(GRAY).font('Helvetica')
           .text(label, totX + 4, rY + 4, { width: totW - 70 })
        doc.fillColor(BLACK).font('Helvetica-Bold')
           .text(value, totX,     rY + 4, { width: totW - 8, align: 'right' })
        doc.y = rY + 20
      }
    }

    totRow('Základ DPH (21%)', formatCZK(totalBase))
    totRow('DPH 21%', formatCZK(totalVat))
    totRow('Celkem k úhradě', formatCZK(total), true)

    doc.y += 16

    // ── PAYMENT BOX ───────────────────────────────────────────────────────────
    const payY = doc.y
    doc.roundedRect(40, payY, W, 90, 4).fill('#f0faf2').stroke('#d4edda')
    doc.fontSize(9).fillColor(GREEN).font('Helvetica-Bold')
       .text('Platební údaje', 52, payY + 10)

    const payData = [
      ['IBAN:', BANK.iban],
      ['SWIFT/BIC:', BANK.swift],
      ['Banka:', BANK.bank],
      ['Variabilní symbol:', orderNumber],
      ['Částka k úhradě:', formatCZK(total)],
    ]
    payData.forEach(([label, value], i) => {
      const pY = payY + 24 + i * 13
      doc.fontSize(8).fillColor(GRAY).font('Helvetica').text(label, 52, pY, { width: 110 })
      doc.fillColor(BLACK).font('Helvetica-Bold').text(value, 165, pY, { width: 360 })
    })

    // ── FOOTER ────────────────────────────────────────────────────────────────
    const footY = 800
    doc.moveTo(40, footY).lineTo(555, footY).lineWidth(0.5).strokeColor('#e5e7eb').stroke()
    doc.fontSize(7.5).fillColor(GRAY).font('Helvetica')
       .text(`${SELLER.name} · Reg. ${SELLER.reg} · ${SELLER.address}`, 40, footY + 6, { width: W - 80 })
       .text('nejlevnejsi-skoda.cz', 40, footY + 6, { width: W, align: 'right' })

    doc.end()
  })
}
