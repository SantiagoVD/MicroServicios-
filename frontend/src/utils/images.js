// Utility to resolve product images from assets/img using Vite's import.meta.glob
// It maps filenames to URLs and provides a robust lookup by normalized name.

const images = import.meta.glob('../assets/img/*', { eager: true, as: 'url' })

function normalizeName(value) {
  if (!value) return ''
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .toLowerCase()
    .replace(/\s+/g, ' ') // collapse spaces
    .trim()
    .replace(/[^a-z0-9 -]/g, '') // keep alnum, space, dash
}

// Build a map of normalized basenames (without extension) to resolved URLs
const imageMap = (() => {
  const map = {}
  for (const [path, url] of Object.entries(images)) {
    const file = path.split('/').pop() || ''
    const base = file.replace(/\.[^.]+$/, '') // remove extension
    const key = normalizeName(base)
    if (key) map[key] = url
  }
  return map
})()

function findByCategory(category) {
  const normCat = normalizeName(category)
  if (!normCat) return null
  // Pick first image whose normalized name contains the category keyword
  const entry = Object.entries(imageMap).find(([k]) => k.includes(normCat))
  return entry ? entry[1] : null
}

export function getImageForProduct(product) {
  if (!product) return null
  const byName = imageMap[normalizeName(product.nombre)]
  if (byName) return byName

  // Try fallback by category keyword (e.g., laptop, monitor, impresora, desktop)
  const byCat = findByCategory(product.categoria)
  if (byCat) return byCat

  // Ultimate fallback: pick a stable existing image
  return imageMap[normalizeName('Laptop Dell Inspiron 15')] || null
}

