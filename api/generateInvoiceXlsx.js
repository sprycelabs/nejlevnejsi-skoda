import ExcelJS from 'exceljs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PROFORMA_DEPOSIT = 200000

const GREEN       = 'FF1e7e34'
const GREEN_LIGHT = 'FFf0faf2'
const GREEN_BORDER= 'FFc6e6cc'
const DARK        = 'FF111827'
const GRAY        = 'FF6b7280'
const LGRAY       = 'FFf5f5f5'
const MGRAY       = 'FFe5e7eb'
const ORANGE      = 'FFdc6803'
const YELLOW_BG   = 'FFfffbeb'
const YELLOW_BDR  = 'FFfbbf24'
const WHITE       = 'FFFFFFFF'

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

function cell(ws, row, col) {
  return ws.getCell(row, col)
}

function setCell(ws, row, col, value, opts = {}) {
  const c = ws.getCell(row, col)
  c.value = value
  if (opts.bold)      c.font = { ...(c.font || {}), bold: true, size: opts.size || 10, color: opts.color ? { argb: opts.color } : undefined, name: 'Calibri' }
  else                c.font = { name: 'Calibri', size: opts.size || 10, color: opts.color ? { argb: opts.color } : undefined }
  if (opts.bg)        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opts.bg } }
  if (opts.align)     c.alignment = { horizontal: opts.align, vertical: 'middle', wrapText: !!opts.wrap }
  else                c.alignment = { vertical: 'middle', wrapText: !!opts.wrap }
  if (opts.border)    c.border = opts.border
  return c
}

function mergeFill(ws, r1, c1, r2, c2, bg) {
  ws.mergeCells(r1, c1, r2, c2)
  const c = ws.getCell(r1, c1)
  if (bg) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } }
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

export async function generateInvoiceXlsx({ form, items, orderNumber, logoBase64, variableSymbol }) {
  const wb = new ExcelJS.Workbook()
  wb.creator  = 'Nejlevnejsi-Skoda.cz'
  wb.created  = new Date()

  const ws = wb.addWorksheet('Proforma faktura', {
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

  const issueDate = new Date()
  const dueDate   = addDays(issueDate, 3)
  const vs        = variableSymbol || orderNumber
  const isCompany = !!form.companyName
  const buyerName = isCompany ? form.companyName : `${form.firstName} ${form.lastName}`

  const totalQty = items.reduce((sum, { qty }) => sum + qty, 0)
  const PROFORMA_AMOUNT = PROFORMA_DEPOSIT * totalQty

  const carItems = items.map(({ car, qty }) => ({
    name:  `${car.name} ${car.variant}`,
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
    const logoId = wb.addImage({
      base64:    logoBase64,
      extension: 'png',
    })
    ws.addImage(logoId, {
      tl: { col: 0.2, row: r - 0.8 },
      ext: { width: 130, height: 32 },
    })
  } else {
    setCell(ws, r, 1, 'Nejlevnější-Škoda.cz', { bold: true, size: 13, color: GREEN, bg: WHITE })
  }

  ws.mergeCells(r, 4, r, 6)
  setCell(ws, r, 4, `Proforma faktura č. ${orderNumber}`, {
    bold: true, size: 14, color: DARK, bg: WHITE, align: 'right',
  })
  r++

  rowHeight(ws, r, 16)
  ws.mergeCells(r, 4, r, 6)
  setCell(ws, r, 4, 'Není daňovým dokladem', {
    size: 9, color: ORANGE, bg: WHITE, align: 'right',
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

  // Seller name + buyer name
  rowHeight(ws, r, 16)
  setCell(ws, r, 2, SELLER.name,  { bold: true, size: 10, color: DARK })
  setCell(ws, r, 4, buyerName,    { bold: true, size: 10, color: DARK })
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

  // Datum vystavení
  rowHeight(ws, r, 14)
  setCell(ws, r, 2, 'Datum vystavení:', { size: 9, color: GRAY })
  setCell(ws, r, 3, formatDate(issueDate), { bold: true, size: 9, color: DARK })
  r++
  r++ // mezera

  // ── PLATEBNÍ STRIP (3 boxy) ───────────────────────────────────────────────
  const stripData = [
    { label: 'Číslo účtu:',        value: BANK.account },
    { label: 'Datum splatnosti:',  value: formatDate(dueDate) },
    { label: 'Variabilní symbol:', value: vs },
  ]

  // label row
  rowHeight(ws, r, 14)
  setCell(ws, r, 2, stripData[0].label, { size: 8, color: GRAY, bg: LGRAY, border: { top: thinBorder().top, left: thinBorder().left, right: thinBorder().right } })
  setCell(ws, r, 3, stripData[1].label, { size: 8, color: GRAY, bg: LGRAY, border: { top: thinBorder().top, left: thinBorder().left, right: thinBorder().right } })
  ws.mergeCells(r, 4, r, 5)
  setCell(ws, r, 4, stripData[2].label, { size: 8, color: GRAY, bg: LGRAY, border: { top: thinBorder().top, left: thinBorder().left, right: thinBorder().right } })
  r++

  // value row
  rowHeight(ws, r, 22)
  setCell(ws, r, 2, stripData[0].value, { bold: true, size: 11, color: DARK, bg: LGRAY, border: { bottom: thinBorder().bottom, left: thinBorder().left, right: thinBorder().right } })
  setCell(ws, r, 3, stripData[1].value, { bold: true, size: 11, color: DARK, bg: LGRAY, border: { bottom: thinBorder().bottom, left: thinBorder().left, right: thinBorder().right } })
  ws.mergeCells(r, 4, r, 5)
  setCell(ws, r, 4, stripData[2].value, { bold: true, size: 11, color: DARK, bg: LGRAY, border: { bottom: thinBorder().bottom, left: thinBorder().left, right: thinBorder().right } })
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
    rowHeight(ws, r, 18)
    const bg = i % 2 ? LGRAY : WHITE
    setCell(ws, r, 2, item.name, { size: 9, color: DARK, bg, border: bottomBorder() })
    setCell(ws, r, 3, item.qty,  { size: 9, color: DARK, bg, align: 'center', border: bottomBorder() })
    ws.mergeCells(r, 4, r, 5)
    setCell(ws, r, 4, czk(item.total), { bold: true, size: 9, color: GREEN, bg, align: 'right', border: bottomBorder() })
    r++
  })

  // Free items
  freeItems.forEach(name => {
    rowHeight(ws, r, 16)
    setCell(ws, r, 2, name,      { size: 9, color: GRAY, bg: GREEN_LIGHT, border: bottomBorder(GREEN_BORDER) })
    setCell(ws, r, 3, 1,         { size: 9, color: GRAY, bg: GREEN_LIGHT, align: 'center', border: bottomBorder(GREEN_BORDER) })
    ws.mergeCells(r, 4, r, 5)
    setCell(ws, r, 4, 'ZDARMA',  { size: 9, color: GRAY, bg: GREEN_LIGHT, align: 'right', border: bottomBorder(GREEN_BORDER) })
    r++
  })
  r++ // mezera

  // ── PŘEDMĚT PLNĚNÍ ────────────────────────────────────────────────────────
  rowHeight(ws, r, 14)
  ws.mergeCells(r, 2, r, 5)
  setCell(ws, r, 2, 'PŘEDMĚT PLNĚNÍ:', {
    bold: true, size: 9, color: GREEN, bg: GREEN_LIGHT,
    border: { top: { style: 'medium', color: { argb: GREEN } }, left: { style: 'medium', color: { argb: GREEN } }, right: { style: 'medium', color: { argb: GREEN } } },
  })
  r++

  rowHeight(ws, r, 26)
  ws.mergeCells(r, 2, r, 3)
  setCell(ws, r, 2, 'Záloha na vozidlo dle výše uvedené objednávky', {
    size: 9, color: DARK, bg: GREEN_LIGHT,
    border: { bottom: { style: 'medium', color: { argb: GREEN } }, left: { style: 'medium', color: { argb: GREEN } } },
  })
  ws.mergeCells(r, 4, r, 5)
  setCell(ws, r, 4, czk(PROFORMA_AMOUNT), {
    bold: true, size: 13, color: DARK, bg: GREEN_LIGHT, align: 'right',
    border: { bottom: { style: 'medium', color: { argb: GREEN } }, right: { style: 'medium', color: { argb: GREEN } } },
  })
  r++
  r++ // mezera

  // ── CELKEM K ÚHRADĚ ───────────────────────────────────────────────────────
  rowHeight(ws, r, 28)
  ws.mergeCells(r, 2, r, 3)
  setCell(ws, r, 2, 'Celkem k úhradě:', {
    bold: true, size: 11, color: WHITE, bg: GREEN, align: 'left',
    border: thinBorder(GREEN),
  })
  ws.mergeCells(r, 4, r, 5)
  setCell(ws, r, 4, czk(PROFORMA_AMOUNT), {
    bold: true, size: 13, color: WHITE, bg: GREEN, align: 'right',
    border: thinBorder(GREEN),
  })
  r++
  r++ // mezera

  // ── PLATEBNÍ ÚDAJE ────────────────────────────────────────────────────────
  rowHeight(ws, r, 16)
  ws.mergeCells(r, 2, r, 5)
  setCell(ws, r, 2, 'Platební údaje', {
    bold: true, size: 10, color: GREEN, bg: GREEN_LIGHT,
    border: { top: { style: 'thin', color: { argb: GREEN_BORDER } }, left: { style: 'thin', color: { argb: GREEN_BORDER } }, right: { style: 'thin', color: { argb: GREEN_BORDER } } },
  })
  r++

  const payRows = [
    ['IBAN:',              BANK.account],
    ['SWIFT/BIC:',         BANK.swift],
    ['Banka:',             BANK.bank],
    ['Variabilní symbol:', vs],
  ]
  payRows.forEach(([label, value], i) => {
    rowHeight(ws, r, 16)
    setCell(ws, r, 2, label, {
      size: 9, color: GRAY, bg: GREEN_LIGHT,
      border: {
        bottom: i === payRows.length - 1 ? { style: 'thin', color: { argb: GREEN_BORDER } } : undefined,
        left:   { style: 'thin', color: { argb: GREEN_BORDER } },
      },
    })
    ws.mergeCells(r, 3, r, 5)
    setCell(ws, r, 3, value, {
      bold: true, size: 9, color: DARK, bg: GREEN_LIGHT,
      border: {
        bottom: i === payRows.length - 1 ? { style: 'thin', color: { argb: GREEN_BORDER } } : undefined,
        right:  { style: 'thin', color: { argb: GREEN_BORDER } },
      },
    })
    r++
  })
  r++ // mezera

  // ── PRÁVNÍ TEXTY ─────────────────────────────────────────────────────────
  rowHeight(ws, r, 30)
  ws.mergeCells(r, 2, r, 5)
  setCell(ws, r, 2,
    'Tato proforma faktura není daňovým dokladem. DPH bude vyčísleno na daňovém dokladu (faktuře) vystavené při dodání zboží.',
    { size: 8, color: 'FF92400e', bg: YELLOW_BG, wrap: true,
      border: { top: { style: 'thin', color: { argb: YELLOW_BDR } }, left: { style: 'thin', color: { argb: YELLOW_BDR } }, right: { style: 'thin', color: { argb: YELLOW_BDR } } },
    }
  )
  r++

  rowHeight(ws, r, 30)
  ws.mergeCells(r, 2, r, 5)
  setCell(ws, r, 2,
    `Společnost ${SELLER.name}, se sídlem v Kyperské republice, je registrována k dani z přidané hodnoty v České republice dle příslušných právních předpisů.`,
    { size: 8, color: GRAY, bg: YELLOW_BG, wrap: true,
      border: { bottom: { style: 'thin', color: { argb: YELLOW_BDR } }, left: { style: 'thin', color: { argb: YELLOW_BDR } }, right: { style: 'thin', color: { argb: YELLOW_BDR } } },
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
