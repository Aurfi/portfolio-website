// Simple script to generate PWA icons
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
const iconsDir = path.join(__dirname, '../public/icons')

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// Generate SVG icons for each size
sizes.forEach((size) => {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="${size * 0.15}" fill="url(#grad)"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold">P</text>
</svg>`

  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg)
  console.log(`Generated icon-${size}x${size}.svg`)
})

// Generate shortcut icons
const shortcuts = [
  { name: 'projects', icon: '📁' },
  { name: 'about', icon: '👤' },
  { name: 'contact', icon: '📧' },
]

shortcuts.forEach((shortcut) => {
  const svg = `<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" rx="14" fill="#2563eb"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-size="48">${shortcut.icon}</text>
</svg>`

  fs.writeFileSync(path.join(iconsDir, `shortcut-${shortcut.name}.svg`), svg)
  console.log(`Generated shortcut-${shortcut.name}.svg`)
})

// Generate badge icon
const badgeSvg = `<svg width="72" height="72" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
  <circle cx="36" cy="36" r="36" fill="#2563eb"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" fill="white" font-family="Arial, sans-serif" font-size="32" font-weight="bold">P</text>
</svg>`

fs.writeFileSync(path.join(iconsDir, 'badge-72x72.svg'), badgeSvg)
console.log('Generated badge-72x72.svg')

console.log('All PWA icons generated successfully!')
