import sharp from 'sharp'
import { readdirSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const ROOT   = fileURLToPath(new URL('..', import.meta.url))
const PUBLIC = join(ROOT, 'public')

const tasks = [
  // Škoda logo — 2 MB ale zobrazuje se na 116×77 px
  { src: 'logo/skoda.webp',     width: 300,  quality: 80 },

  // Loga partnerů
  { src: 'logo/borgesius.webp', width: 400,  quality: 75 },
  { src: 'logo/ahold.webp',     width: 400,  quality: 75 },
  { src: 'logo/amazon.webp',    width: 400,  quality: 75 },
  { src: 'logo/bolt.webp',      width: 300,  quality: 75 },
  { src: 'logo/bayer.webp',     width: 200,  quality: 75 },

  // Hlavní obrázky
  { src: 'car-01.webp',         width: 900,  quality: 80 },

  // Auta
  ...readdirSync(join(PUBLIC, 'cars'))
    .filter(f => f.endsWith('.webp'))
    .map(f => ({ src: `cars/${f}`, width: 700, quality: 78 })),
]

let totalSaved = 0

for (const { src, width, quality } of tasks) {
  const path = join(PUBLIC, src)
  try {
    const before = statSync(path).size
    const buf = await sharp(path)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer()
    writeFileSync(path, buf)
    const diff = before - buf.length
    totalSaved += diff
    console.log(`✅ ${src.padEnd(35)} ${(before/1024).toFixed(0).padStart(6)} KB → ${(buf.length/1024).toFixed(0).padStart(5)} KB  (-${(diff/1024).toFixed(0)} KB)`)
  } catch (e) {
    console.log(`❌ ${src}: ${e.message}`)
  }
}

console.log(`\n🎉 Celková úspora: ${(totalSaved / 1024).toFixed(0)} KB`)
