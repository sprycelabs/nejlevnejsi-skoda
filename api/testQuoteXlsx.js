import { generateQuoteXlsx } from './generateQuoteXlsx.js'
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
  { car: { name: 'Škoda Karoq', variant: '1.5 TSI 110 kW DSG', salePrice: 639900, internalId: 'TMBxxxxxxV/0001' }, qty: 1 },
]

const quoteNumber = 'NAB-2026-001'

const logoPath   = path.join(__dirname, '..', 'public', 'logo.png')
const logoBase64 = fs.existsSync(logoPath) ? fs.readFileSync(logoPath).toString('base64') : null

const wb = await generateQuoteXlsx({ form, items, quoteNumber, logoBase64 })

const outPath = path.join('C:\\Users\\schon\\Documents', `nabidka-${quoteNumber}.xlsx`)
await wb.xlsx.writeFile(outPath)
console.log(`✅ Excel uložen: ${outPath}`)
