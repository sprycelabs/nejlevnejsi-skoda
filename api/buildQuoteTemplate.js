import { generateQuoteXlsx } from './generateQuoteXlsx.js'

const form = {
  firstName: '', lastName: '', companyName: '',
  email: '', phone: '', street: '', zip: '', city: '', ico: '', dic: '',
}

const items = Array.from({ length: 20 }, () => ({
  car: { name: '', variant: '', salePrice: 0 }, qty: 1,
}))

const wb = await generateQuoteXlsx({ form, items, quoteNumber: 'NAB-____-___', logoBase64: null })
await wb.xlsx.writeFile('C:\\Users\\schon\\Documents\\nabidka-sablona.xlsx')
console.log('✅ Šablona uložena: C:\\Users\\schon\\Documents\\nabidka-sablona.xlsx')
