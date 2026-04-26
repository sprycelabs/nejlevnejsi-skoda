import React from 'react'
import {
  Document, Page, Text, View, Image, StyleSheet, renderToBuffer, Font,
} from '@react-pdf/renderer'

// ── Colours & constants ───────────────────────────────────────────────────────
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

// Placeholder — nahradit reálným účtem
const BANK = {
  iban:   'CZ00 0000 0000 0000 0000 0000',
  swift:  'XXXXXXXX',
  bank:   'Placeholder Bank',
}

const VAT_RATE = 0.21

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatCZK(amount) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency', currency: 'CZK', maximumFractionDigits: 0,
  }).format(amount)
}

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('cs-CZ', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page:         { fontFamily: 'Helvetica', fontSize: 9, color: BLACK, padding: '32pt 40pt' },
  // Header
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  logo:         { width: 120, objectFit: 'contain' },
  invoiceLabel: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: GREEN, textAlign: 'right' },
  invoiceNum:   { fontSize: 10, color: GRAY, textAlign: 'right', marginTop: 2 },
  // Divider
  divider:      { height: 1.5, backgroundColor: GREEN, marginBottom: 18 },
  // Two-column info
  twoCol:       { flexDirection: 'row', gap: 24, marginBottom: 20 },
  col:          { flex: 1 },
  colLabel:     { fontSize: 7, fontFamily: 'Helvetica-Bold', color: GREEN, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  infoLine:     { fontSize: 9, color: BLACK, marginBottom: 3, lineHeight: 1.4 },
  infoLineSm:   { fontSize: 8, color: GRAY, marginBottom: 2, lineHeight: 1.4 },
  bold:         { fontFamily: 'Helvetica-Bold' },
  // Meta strip (dates, VS)
  metaStrip:    { flexDirection: 'row', backgroundColor: LGRAY, borderRadius: 4, padding: '8pt 12pt', marginBottom: 20, gap: 0 },
  metaItem:     { flex: 1, alignItems: 'center' },
  metaLabel:    { fontSize: 7, color: GRAY, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.6 },
  metaValue:    { fontSize: 9, fontFamily: 'Helvetica-Bold', color: BLACK },
  metaDivider:  { width: 1, backgroundColor: '#e5e7eb', marginHorizontal: 4 },
  // Table
  tableHead:    { flexDirection: 'row', backgroundColor: DARK, borderRadius: '3pt 3pt 0 0', padding: '7pt 8pt' },
  thText:       { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  tableRow:     { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', padding: '7pt 8pt', alignItems: 'center' },
  tableRowAlt:  { backgroundColor: '#f9fafb' },
  tableRowFree: { backgroundColor: '#f0faf2' },
  tdText:       { fontSize: 9, color: BLACK },
  tdTextSm:     { fontSize: 7.5, color: GRAY, marginTop: 1 },
  tdGreen:      { fontSize: 9, fontFamily: 'Helvetica-Bold', color: GREEN },
  // Column widths
  colDesc:      { flex: 1 },
  colQty:       { width: 28, textAlign: 'center' },
  colBase:      { width: 68, textAlign: 'right' },
  colVat:       { width: 52, textAlign: 'right' },
  colTotal:     { width: 68, textAlign: 'right' },
  // Totals
  totalsWrap:   { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4, marginBottom: 20 },
  totalsBox:    { width: 220 },
  totalRow:     { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  totalRowFinal:{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: GREEN, borderRadius: 4, padding: '8pt 10pt', marginTop: 6 },
  totalLabel:   { fontSize: 9, color: GRAY },
  totalValue:   { fontSize: 9, fontFamily: 'Helvetica-Bold', color: BLACK },
  totalLabelFin:{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  totalValueFin:{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  // Payment
  payBox:       { backgroundColor: '#f0faf2', borderWidth: 1, borderColor: '#d4edda', borderRadius: 4, padding: '12pt 14pt', marginBottom: 16 },
  payTitle:     { fontSize: 9, fontFamily: 'Helvetica-Bold', color: GREEN, marginBottom: 8 },
  payRow:       { flexDirection: 'row', marginBottom: 4 },
  payLabel:     { fontSize: 8, color: GRAY, width: 90 },
  payValue:     { fontSize: 8, fontFamily: 'Helvetica-Bold', color: BLACK, flex: 1 },
  // Footer
  footer:       { position: 'absolute', bottom: 24, left: 40, right: 40, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  footerText:   { fontSize: 7.5, color: GRAY },
})

// ── Invoice Document ──────────────────────────────────────────────────────────
function InvoiceDoc({ form, items, total, orderNumber, logoBase64, issueDate, dueDate }) {
  const isCompany = !!form.companyName
  const buyerName = isCompany ? form.companyName : `${form.firstName} ${form.lastName}`

  // Car items with VAT breakdown
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

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ── HEADER ── */}
        <View style={s.header}>
          {logoBase64
            ? <Image src={`data:image/png;base64,${logoBase64}`} style={s.logo} />
            : <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: GREEN }}>Nejlevnější-Škoda.cz</Text>
          }
          <View>
            <Text style={s.invoiceLabel}>FAKTURA</Text>
            <Text style={s.invoiceNum}>{orderNumber}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* ── SELLER / BUYER ── */}
        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.colLabel}>Prodávající</Text>
            <Text style={[s.infoLine, s.bold]}>{SELLER.name}</Text>
            <Text style={s.infoLineSm}>Reg. číslo: {SELLER.reg}</Text>
            <Text style={s.infoLineSm}>{SELLER.address}</Text>
          </View>
          <View style={s.col}>
            <Text style={s.colLabel}>Kupující</Text>
            <Text style={[s.infoLine, s.bold]}>{buyerName}</Text>
            {isCompany && form.ico && <Text style={s.infoLineSm}>IČO: {form.ico}</Text>}
            {isCompany && form.dic && <Text style={s.infoLineSm}>DIČ: {form.dic}</Text>}
            <Text style={s.infoLineSm}>{form.street}</Text>
            <Text style={s.infoLineSm}>{form.zip} {form.city}</Text>
            <Text style={s.infoLineSm}>{form.email}</Text>
            <Text style={s.infoLineSm}>{form.phone}</Text>
          </View>
        </View>

        {/* ── META STRIP ── */}
        <View style={s.metaStrip}>
          <View style={s.metaItem}>
            <Text style={s.metaLabel}>Datum vystavení</Text>
            <Text style={s.metaValue}>{formatDate(issueDate)}</Text>
          </View>
          <View style={s.metaDivider} />
          <View style={s.metaItem}>
            <Text style={s.metaLabel}>Datum splatnosti</Text>
            <Text style={s.metaValue}>{formatDate(dueDate)}</Text>
          </View>
          <View style={s.metaDivider} />
          <View style={s.metaItem}>
            <Text style={s.metaLabel}>Variabilní symbol</Text>
            <Text style={s.metaValue}>{orderNumber}</Text>
          </View>
          <View style={s.metaDivider} />
          <View style={s.metaItem}>
            <Text style={s.metaLabel}>Způsob platby</Text>
            <Text style={s.metaValue}>Bankovní převod</Text>
          </View>
        </View>

        {/* ── ITEMS TABLE ── */}
        {/* Head */}
        <View style={s.tableHead}>
          <Text style={[s.thText, s.colDesc]}>Popis</Text>
          <Text style={[s.thText, s.colQty]}>Ks</Text>
          <Text style={[s.thText, s.colBase]}>Základ DPH</Text>
          <Text style={[s.thText, s.colVat]}>DPH 21%</Text>
          <Text style={[s.thText, s.colTotal]}>Celkem vč. DPH</Text>
        </View>

        {/* Car rows */}
        {carItems.map((item, i) => (
          <View key={i} style={[s.tableRow, i % 2 === 1 && s.tableRowAlt]}>
            <View style={s.colDesc}>
              <Text style={s.tdText}>{item.name}</Text>
              <Text style={s.tdTextSm}>Nový osobní automobil</Text>
            </View>
            <Text style={[s.tdText, s.colQty]}>{item.qty}</Text>
            <Text style={[s.tdText, s.colBase]}>{formatCZK(item.base)}</Text>
            <Text style={[s.tdText, s.colVat]}>{formatCZK(item.vat)}</Text>
            <Text style={[s.tdGreen, s.colTotal]}>{formatCZK(item.total)}</Text>
          </View>
        ))}

        {/* Free items */}
        {freeItems.map((name, i) => (
          <View key={`free-${i}`} style={[s.tableRow, s.tableRowFree]}>
            <View style={s.colDesc}>
              <Text style={s.tdText}>{name}</Text>
            </View>
            <Text style={[s.tdText, s.colQty]}>1</Text>
            <Text style={[s.tdText, s.colBase]}>{formatCZK(0)}</Text>
            <Text style={[s.tdText, s.colVat]}>{formatCZK(0)}</Text>
            <Text style={[s.tdGreen, s.colTotal]}>{formatCZK(0)}</Text>
          </View>
        ))}

        {/* ── TOTALS ── */}
        <View style={s.totalsWrap}>
          <View style={s.totalsBox}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Základ DPH (21%)</Text>
              <Text style={s.totalValue}>{formatCZK(totalBase)}</Text>
            </View>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>DPH 21%</Text>
              <Text style={s.totalValue}>{formatCZK(totalVat)}</Text>
            </View>
            <View style={s.totalRowFinal}>
              <Text style={s.totalLabelFin}>Celkem k úhradě</Text>
              <Text style={s.totalValueFin}>{formatCZK(total)}</Text>
            </View>
          </View>
        </View>

        {/* ── PAYMENT DETAILS ── */}
        <View style={s.payBox}>
          <Text style={s.payTitle}>Platební údaje</Text>
          <View style={s.payRow}>
            <Text style={s.payLabel}>IBAN:</Text>
            <Text style={s.payValue}>{BANK.iban}</Text>
          </View>
          <View style={s.payRow}>
            <Text style={s.payLabel}>SWIFT/BIC:</Text>
            <Text style={s.payValue}>{BANK.swift}</Text>
          </View>
          <View style={s.payRow}>
            <Text style={s.payLabel}>Banka:</Text>
            <Text style={s.payValue}>{BANK.bank}</Text>
          </View>
          <View style={s.payRow}>
            <Text style={s.payLabel}>Variabilní symbol:</Text>
            <Text style={s.payValue}>{orderNumber}</Text>
          </View>
          <View style={s.payRow}>
            <Text style={s.payLabel}>Částka:</Text>
            <Text style={s.payValue}>{formatCZK(total)}</Text>
          </View>
        </View>

        {/* ── FOOTER ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>{SELLER.name} · Reg. {SELLER.reg} · {SELLER.address}</Text>
          <Text style={s.footerText}>nejlevnejsi-skoda.cz</Text>
        </View>

      </Page>
    </Document>
  )
}

// ── Export ────────────────────────────────────────────────────────────────────
export async function generateInvoicePDF({ form, items, total, orderNumber, logoBase64 }) {
  const issueDate = new Date()
  const dueDate   = addDays(issueDate, 3)

  const doc = (
    <InvoiceDoc
      form={form}
      items={items}
      total={total}
      orderNumber={orderNumber}
      logoBase64={logoBase64}
      issueDate={issueDate}
      dueDate={dueDate}
    />
  )

  return renderToBuffer(doc)
}
