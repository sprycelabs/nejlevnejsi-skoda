import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Nejlevnější Škoda'
const SITE_URL  = 'https://nejlevnejsi-skoda.cz'
const OG_IMAGE  = `${SITE_URL}/og-image.png`

export default function SEO({
  title,
  description,
  canonical,
  image,
  noindex = false,
  type = 'website',
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : null

  return (
    <Helmet>
      <html lang="cs" />
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noindex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow" />
      }
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type"      content={type} />
      <meta property="og:title"     content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image"     content={image || OG_IMAGE} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:locale"    content="cs_CZ" />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image"       content={image || OG_IMAGE} />
    </Helmet>
  )
}
