import { cars } from '../src/data/cars.js'

const BASE_URL = 'https://www.nejlevnejsi-skoda.cz'

const STATIC = [
  { url: '/',          priority: '1.0', changefreq: 'daily' },
  { url: '/vozy',      priority: '0.9', changefreq: 'daily' },
  { url: '/o-nas',     priority: '0.7', changefreq: 'monthly' },
  { url: '/kontakt',   priority: '0.7', changefreq: 'monthly' },
  { url: '/faq',       priority: '0.6', changefreq: 'monthly' },
  { url: '/pomahame',  priority: '0.6', changefreq: 'monthly' },
  { url: '/stazeni',   priority: '0.5', changefreq: 'monthly' },
]

export default function handler(req, res) {
  const today = new Date().toISOString().split('T')[0]

  const staticUrls = STATIC.map(p => `
  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`)

  const carUrls = cars.map(car => `
  <url>
    <loc>${BASE_URL}/vozy/${car.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...carUrls].join('')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  res.status(200).send(xml)
}
