import { generateInvoiceXlsx } from './generateInvoiceXlsx.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const form = {
  firstName: 'Jan',
  lastName:  'Novák',
  email:     'jan.novak@email.cz',
  phone:     '+420 777 123 456',
  street:    'Náměstí Míru 1',
  zip:       '120 00',
  city:      'Praha 2',
  companyName: '',
}

const items = [
  { car: { name: 'Škoda Kodiaq', variant: '2.0 TDI 4x4', salePrice: 1250000 }, qty: 1 },
]

const orderNumber    = 'OBJ-2026-001'
const variableSymbol = '20260014823'

const logoPath   = path.join(__dirname, '..', 'public', 'logo.png')
const logoBase64 = fs.existsSync(logoPath) ? fs.readFileSync(logoPath).toString('base64') : null

const wb = await generateInvoiceXlsx({ form, items, orderNumber, logoBase64, variableSymbol })

const outPath = 'C:\\Users\\schon\\Documents\\proforma-OBJ-2026-001.xlsx'
await wb.xlsx.writeFile(outPath)
console.log(`✅ Excel uložen: ${outPath}`)
