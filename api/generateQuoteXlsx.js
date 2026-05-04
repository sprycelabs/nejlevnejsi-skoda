import ExcelJS from 'exceljs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const MIN_ITEM_ROWS = 20

const GREEN       = 'FF1e7e34'
const GREEN_LIGHT = 'FFf0faf2'
const GREEN_BORDER= 'FFc6e6cc'
const DARK        = 'FF111827'
const GRAY        = 'FF6b7280'
const LGRAY       = 'FFf5f5f5'
const MGRAY       = 'FFe5e7eb'
const WHITE       = 'FFFFFFFF'

const SELLER = {
  name:    'TOP GLOBAL STRATEGIC MANAGEMENT LTD',
  reg:     '490247',
  address: 'Gladstonos 83, 3032',
  city:    'Limassol, Kypr',
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

function setCell(ws, row, col, value, opts = {}) {
  const c = ws.getCell(row, col)
  c.value = value
  if (opts.bold) c.font = { ...(c.font || {}), bold: true, size: opts.size || 10, color: opts.color ? { argb: opts.color } : undefined, name: 'Calibri' }
  else           c.font = { name: 'Calibri', size: opts.size || 10, color: opts.color ? { argb: opts.color } : undefined }
  if (opts.bg)   c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opts.bg } }
  if (opts.align) c.alignment = { horizontal: opts.align, vertical: 'middle', wrapText: !!opts.wrap }
  else            c.alignment = { vertical: 'middle', wrapText: !!opts.wrap }
  if (opts.border) c.border = opts.border
  return c
}

function rowHeight(ws, row, h) {
  ws.getRow(row).height = h
}

const thinBorder = (color = MGRAY) => ({
  top:    { style: 'thin', color: { argb: color } },
  left:   { style: 'thin', color: { argb: color } },
  bottom: { style: 'thin', color: { argb: color } },
  right:  { style: 'thin', color: { argb: color } },
})

const bottomBorder = (color = MGRAY) => ({
  bottom: { style: 'thin', color: { argb: color } },
})

export async function generateQuoteXlsx({ form, items, quoteNumber, logoBase64, discount }) {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'Nejlevnejsi-Skoda.cz'
  wb.created = new Date()

  const ws = wb.addWorksheet('Nabídka', {
    pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
    properties: { defaultColWidth: 12 },
  })

  // Column widths (A–F)
  ws.columns = [
    { width: 4  },  // A — indent
    { width: 32 },  // B — popis
    { width: 10 },  // C — ks
    { width: 20 },  // D — cena / labels
    { width: 18 },  // E — values
    { width: 4  },  // F — right margin
  ]

  const issueDate   = new Date()
  const validUntil  = addDays(issueDate, 30)
  const isCompany   = !!form.companyName
  const buyerName   = isCompany ? form.companyName : `${form.firstName} ${form.lastName}`

  const totalQty = items.reduce((sum, { qty }) => sum + qty, 0)

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

  let r = 1

  // ── ZELENÝ PRUH NAHOŘE ────────────────────────────────────────────────────
  ws.mergeCells(r, 1, r, 6)
  const headerBar = ws.getCell(r, 1)
  headerBar.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREEN } }
  rowHeight(ws, r, 8)
  r++

  // ── LOGO + NÁZEV DOKUMENTU ────────────────────────────────────────────────
  rowHeight(ws, r, 40)
  ws.mergeCells(r, 1, r, 3)
  const logoCell = ws.getCell(r, 1)
  logoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: WHITE } }

  if (logoBase64) {
    const logoId = wb.addImage({ base64: logoBase64, extension: 'png' })
    ws.addImage(logoId, {
      tl: { col: 0.2, row: r - 0.8 },
      ext: { width: 130, height: 32 },
    })
  } else {
    setCell(ws, r, 1, 'Nejlevnější-Škoda.cz', { bold: true, size: 13, color: GREEN, bg: WHITE })
  }

  ws.mergeCells(r, 4, r, 6)
  setCell(ws, r, 4, `Nabídka č. ${quoteNumber}`, {
    bold: true, size: 14, color: DARK, bg: WHITE, align: 'right',
  })
  r++

  // zelená čára
  for (let c = 1; c <= 6; c++) {
    const cell = ws.getCell(r, c)
    cell.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREEN } }
    cell.border = { bottom: { style: 'medium', color: { argb: GREEN } } }
  }
  rowHeight(ws, r, 3)
  r++

  // ── DODAVATEL / ODBĚRATEL ─────────────────────────────────────────────────
  rowHeight(ws, r, 14)
  setCell(ws, r, 2, 'Dodavatel:', { bold: true, size: 8, color: GREEN })
  setCell(ws, r, 4, 'Odběratel:', { bold: true, size: 8, color: GREEN })
  r++

  rowHeight(ws, r, 16)
  setCell(ws, r, 2, SELLER.name, { bold: true, size: 10, color: DARK })
  setCell(ws, r, 4, buyerName,   { bold: true, size: 10, color: DARK })
  r++

  const sellerLines = [SELLER.address, SELLER.city, `Reg. číslo: ${SELLER.reg}`]
  const buyerLines  = [
    form.street,
    `${form.zip} ${form.city}`,
    ...(isCompany && form.ico ? [`IČO: ${form.ico}`] : []),
    ...(isCompany && form.dic ? [`DIČ: ${form.dic}`] : []),
    form.email,
    form.phone,
  ]
  const maxLines = Math.max(sellerLines.length, buyerLines.length)

  for (let i = 0; i < maxLines; i++) {
    rowHeight(ws, r, 14)
    if (sellerLines[i]) setCell(ws, r, 2, sellerLines[i], { size: 9, color: GRAY })
    if (buyerLines[i])  setCell(ws, r, 4, buyerLines[i],  { size: 9, color: GRAY })
    r++
  }
  r++ // mezera

  // Datum vystavení + platnost nabídky
  rowHeight(ws, r, 14)
  setCell(ws, r, 2, 'Datum vystavení:', { size: 9, color: GRAY })
  setCell(ws, r, 3, formatDate(issueDate), { bold: true, size: 9, color: DARK })
  r++
  rowHeight(ws, r, 14)
  setCell(ws, r, 2, 'Nabídka platí do:', { size: 9, color: GRAY })
  setCell(ws, r, 3, formatDate(validUntil), { bold: true, size: 9, color: DARK })
  r++
  r++ // mezera

  // ── TABULKA POLOŽEK ───────────────────────────────────────────────────────
  // Header
  rowHeight(ws, r, 22)
  ws.mergeCells(r, 2, r, 2)
  setCell(ws, r, 2, 'Popis položky', { bold: true, size: 9, color: WHITE, bg: DARK, align: 'left' })
  setCell(ws, r, 3, 'Ks',            { bold: true, size: 9, color: WHITE, bg: DARK, align: 'center' })
  ws.mergeCells(r, 4, r, 5)
  setCell(ws, r, 4, 'Cena vč. DPH',  { bold: true, size: 9, color: WHITE, bg: DARK, align: 'right' })
  r++

  // Car rows
  carItems.forEach((item, i) => {
    rowHeight(ws, r, item.internalId ? 36 : 30)
    const bg = i % 2 ? LGRAY : WHITE

    const labelCell = ws.getCell(r, 2)
    labelCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
    labelCell.border    = bottomBorder()
    labelCell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true }
    if (item.internalId) {
      labelCell.value = {
        richText: [
          { text: item.name + '\n', font: { name: 'Calibri', size: 9, bold: false, color: { argb: DARK } } },
          { text: 'Nový osobní automobil', font: { name: 'Calibri', size: 7.5, bold: false, color: { argb: GRAY } } },
          { text: '  ' + item.internalId, font: { name: 'Calibri', size: 7, bold: false, color: { argb: 'FF9CA3AF' } } },
        ],
      }
    } else {
      labelCell.value = {
        richText: [
          { text: item.name + '\nNový osobní automobil', font: { name: 'Calibri', size: 9, bold: false, color: { argb: DARK } } },
        ],
      }
    }

    setCell(ws, r, 3, item.qty, { size: 9, color: DARK, bg, align: 'center', border: bottomBorder() })
    ws.mergeCells(r, 4, r, 5)
    setCell(ws, r, 4, czk(item.total), { bold: true, size: 9, color: GREEN, bg, align: 'right', border: bottomBorder() })
    r++
  })

  // Prázdné řádky — doplnit do min. 20 řádků celkem
  const filledRows = carItems.length
  const emptyRowsNeeded = Math.max(0, MIN_ITEM_ROWS - filledRows)
  for (let i = 0; i < emptyRowsNeeded; i++) {
    rowHeight(ws, r, 30)
    const bg = (filledRows + i) % 2 ? LGRAY : WHITE
    const emptyLabel = ws.getCell(r, 2)
    emptyLabel.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
    emptyLabel.border    = bottomBorder()
    emptyLabel.alignment = { horizontal: 'center', vertical: 'top', wrapText: true }
    setCell(ws, r, 3, '', { bg, border: bottomBorder(), align: 'center' })
    ws.mergeCells(r, 4, r, 5)
    setCell(ws, r, 4, '', { bg, border: bottomBorder(), align: 'right' })
    r++
  }

  // Sleva
  if (discount && discount.amount > 0) {
    const carSubtotal = carItems.reduce((s, it) => s + it.total, 0)
    const discountedSubtotal = carSubtotal - discount.amount
    const discountLabel = discount.type === 'percent'
      ? `Sleva ${discount.value} % (kód: ${discount.code})`
      : `Sleva (kód: ${discount.code})`

    rowHeight(ws, r, 16)
    setCell(ws, r, 2, 'Cena před slevou:', { size: 8.5, color: GRAY, border: bottomBorder() })
    setCell(ws, r, 3, '',                  { size: 8.5, color: GRAY, bg: WHITE, border: bottomBorder() })
    ws.mergeCells(r, 4, r, 5)
    setCell(ws, r, 4, czk(carSubtotal), { size: 8.5, color: GRAY, align: 'right', border: bottomBorder() })
    r++

    rowHeight(ws, r, 16)
    setCell(ws, r, 2, discountLabel,         { bold: true, size: 8.5, color: GREEN, bg: GREEN_LIGHT, border: bottomBorder(GREEN_BORDER) })
    setCell(ws, r, 3, '',                    { size: 8.5, color: GREEN, bg: GREEN_LIGHT, border: bottomBorder(GREEN_BORDER) })
    ws.mergeCells(r, 4, r, 5)
    setCell(ws, r, 4, `− ${czk(discount.amount)}`, { bold: true, size: 8.5, color: 'FFDC2626', bg: GREEN_LIGHT, align: 'right', border: bottomBorder(GREEN_BORDER) })
    r++

    rowHeight(ws, r, 18)
    setCell(ws, r, 2, 'Cena po slevě:',     { bold: true, size: 9.5, color: DARK, bg: GREEN_LIGHT, border: bottomBorder(GREEN_BORDER) })
    setCell(ws, r, 3, '',                    { size: 9.5, color: DARK, bg: GREEN_LIGHT, border: bottomBorder(GREEN_BORDER) })
    ws.mergeCells(r, 4, r, 5)
    setCell(ws, r, 4, czk(discountedSubtotal), { bold: true, size: 10, color: GREEN, bg: GREEN_LIGHT, align: 'right', border: bottomBorder(GREEN_BORDER) })
    r++
  }

  // Free items
  freeItems.forEach(name => {
    rowHeight(ws, r, 16)
    setCell(ws, r, 2, name,     { size: 9, color: GRAY, bg: GREEN_LIGHT, border: bottomBorder(GREEN_BORDER) })
    setCell(ws, r, 3, totalQty, { size: 9, color: GRAY, bg: GREEN_LIGHT, align: 'center', border: bottomBorder(GREEN_BORDER) })
    ws.mergeCells(r, 4, r, 5)
    setCell(ws, r, 4, 'ZDARMA', { size: 9, color: GRAY, bg: GREEN_LIGHT, align: 'right', border: bottomBorder(GREEN_BORDER) })
    r++
  })
  r++ // mezera

  // ── CELKOVÁ CENA NABÍDKY ──────────────────────────────────────────────────
  const grandTotal = discount && discount.amount > 0
    ? carItems.reduce((s, it) => s + it.total, 0) - discount.amount
    : carItems.reduce((s, it) => s + it.total, 0)

  rowHeight(ws, r, 28)
  ws.mergeCells(r, 2, r, 3)
  setCell(ws, r, 2, 'Celková cena nabídky:', {
    bold: true, size: 11, color: WHITE, bg: GREEN, align: 'left',
    border: thinBorder(GREEN),
  })
  ws.mergeCells(r, 4, r, 5)
  setCell(ws, r, 4, czk(grandTotal), {
    bold: true, size: 13, color: WHITE, bg: GREEN, align: 'right',
    border: thinBorder(GREEN),
  })
  r++
  r++ // mezera

  // ── POZNÁMKA ──────────────────────────────────────────────────────────────
  rowHeight(ws, r, 14)
  ws.mergeCells(r, 2, r, 5)
  setCell(ws, r, 2, 'POZNÁMKA:', {
    bold: true, size: 9, color: GREEN, bg: GREEN_LIGHT,
    border: { top: { style: 'thin', color: { argb: GREEN_BORDER } }, left: { style: 'thin', color: { argb: GREEN_BORDER } }, right: { style: 'thin', color: { argb: GREEN_BORDER } } },
  })
  r++

  rowHeight(ws, r, 26)
  ws.mergeCells(r, 2, r, 5)
  setCell(ws, r, 2,
    'Tato nabídka je nezávazná a platí po dobu 30 dní od data vystavení. Ceny jsou uvedeny včetně DPH.',
    { size: 8.5, color: DARK, bg: GREEN_LIGHT, wrap: true,
      border: { bottom: { style: 'thin', color: { argb: GREEN_BORDER } }, left: { style: 'thin', color: { argb: GREEN_BORDER } }, right: { style: 'thin', color: { argb: GREEN_BORDER } } },
    }
  )
  r++
  r++ // mezera

  // ── FOOTER ───────────────────────────────────────────────────────────────
  rowHeight(ws, r, 14)
  ws.mergeCells(r, 1, r, 6)
  const footerLine = ws.getCell(r, 1)
  footerLine.border = { top: { style: 'thin', color: { argb: MGRAY } } }
  r++

  rowHeight(ws, r, 14)
  ws.mergeCells(r, 2, r, 4)
  setCell(ws, r, 2, `${SELLER.name}  ·  Reg. číslo: ${SELLER.reg}  ·  ${SELLER.address}, ${SELLER.city}`, { size: 7, color: GRAY })
  setCell(ws, r, 5, 'nejlevnejsi-skoda.cz', { size: 7, color: GRAY, align: 'right' })

  return wb
}
