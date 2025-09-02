// Simple script to generate PWA screenshots
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const screenshotsDir = path.join(__dirname, '../public/screenshots')

// Ensure screenshots directory exists
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true })
}

// Generate desktop screenshot
const desktopSvg = `<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f8f9fa"/>
  <rect x="0" y="0" width="100%" height="80" fill="#2563eb"/>
  <text x="64" y="50" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">Portfolio</text>
  <rect x="64" y="120" width="600" height="400" rx="8" fill="white" stroke="#e5e7eb"/>
  <text x="364" y="340" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="18">Desktop Portfolio View</text>
  <rect x="700" y="120" width="516" height="400" rx="8" fill="white" stroke="#e5e7eb"/>
  <text x="958" y="340" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="18">Project Showcase</text>
</svg>`

fs.writeFileSync(path.join(screenshotsDir, 'desktop-home.svg'), desktopSvg)

// Generate mobile screenshot
const mobileSvg = `<svg width="390" height="844" viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f8f9fa"/>
  <rect x="0" y="0" width="100%" height="60" fill="#2563eb"/>
  <text x="195" y="38" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">Portfolio</text>
  <rect x="20" y="80" width="350" height="200" rx="8" fill="white" stroke="#e5e7eb"/>
  <text x="195" y="190" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="16">Mobile Hero Section</text>
  <rect x="20" y="300" width="350" height="150" rx="8" fill="white" stroke="#e5e7eb"/>
  <text x="195" y="385" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="16">Projects Grid</text>
  <rect x="20" y="470" width="350" height="150" rx="8" fill="white" stroke="#e5e7eb"/>
  <text x="195" y="555" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="16">About Section</text>
</svg>`

fs.writeFileSync(path.join(screenshotsDir, 'mobile-home.svg'), mobileSvg)

console.log('Generated desktop-home.svg')
console.log('Generated mobile-home.svg')
console.log('All PWA screenshots generated successfully!')
