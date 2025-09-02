import jsPDF from 'jspdf'
import type { ResumeData } from './resumeData'

export class ModernResumePDFGenerator {
  private pdf: jsPDF
  private currentY: number = 0
  private pageWidth: number
  private pageHeight: number
  private margin: number = 20
  
  // Modern color palette
  private colors = {
    primary: '#1e293b',      // Dark slate
    secondary: '#3b82f6',    // Professional blue
    accent: '#06b6d4',       // Cyan
    text: '#374151',         // Gray 700
    lightText: '#6b7280',    // Gray 500
    background: '#f8fafc',   // Slate 50
    white: '#ffffff',
    divider: '#e5e7eb'       // Gray 200
  }

  constructor() {
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    this.pageWidth = this.pdf.internal.pageSize.getWidth()
    this.pageHeight = this.pdf.internal.pageSize.getHeight()
    this.currentY = this.margin
  }

  private hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  private setColor(color: string) {
    const rgb = this.hexToRgb(color)
    return [rgb.r, rgb.g, rgb.b]
  }


  private addText(text: string, x: number, y: number, options: {
    fontSize?: number
    fontStyle?: 'normal' | 'bold'
    color?: string
    align?: 'left' | 'center' | 'right'
    maxWidth?: number
  } = {}) {
    const {
      fontSize = 11,
      fontStyle = 'normal',
      color = this.colors.text,
      align = 'left',
      maxWidth
    } = options

    this.pdf.setFontSize(fontSize)
    this.pdf.setFont('helvetica', fontStyle)
    
    const [r, g, b] = this.setColor(color)
    this.pdf.setTextColor(r, g, b)

    if (maxWidth) {
      const lines = this.pdf.splitTextToSize(text, maxWidth)
      this.pdf.text(lines, x, y, { align })
      return lines.length * (fontSize * 0.35)
    } else {
      this.pdf.text(text, x, y, { align })
      return fontSize * 0.35
    }
  }

  private addBackgroundRect(x: number, y: number, width: number, height: number, color: string) {
    const [r, g, b] = this.setColor(color)
    this.pdf.setFillColor(r, g, b)
    this.pdf.rect(x, y, width, height, 'F')
  }

  private addLine(startX: number, startY: number, endX: number, endY: number, color: string, width: number = 0.5) {
    const [r, g, b] = this.setColor(color)
    this.pdf.setDrawColor(r, g, b)
    this.pdf.setLineWidth(width)
    this.pdf.line(startX, startY, endX, endY)
  }

  private addSectionDivider(x: number, y: number, width: number) {
    // Modern gradient-style divider
    const [r1, g1, b1] = this.setColor(this.colors.secondary)
    this.pdf.setDrawColor(r1, g1, b1)
    this.pdf.setLineWidth(1.5)
    this.pdf.line(x, y, x + width * 0.3, y)
    
    const [r2, g2, b2] = this.setColor(this.colors.accent)
    this.pdf.setDrawColor(r2, g2, b2)
    this.pdf.setLineWidth(0.5)
    this.pdf.line(x + width * 0.35, y, x + width * 0.7, y)
  }

  private createModernHeader(personalInfo: { name: string; email: string; phone?: string; location: string; website?: string }): void {
    // Dark header background
    this.addBackgroundRect(0, 0, this.pageWidth, 55, this.colors.primary)
    
    // Name with modern typography
    this.addText(personalInfo.name, this.pageWidth / 2, 20, {
      fontSize: 28,
      fontStyle: 'bold',
      color: this.colors.white,
      align: 'center'
    })
    
    // Professional title with accent color
    this.addText('Full-Stack Developer & Software Engineer', this.pageWidth / 2, 32, {
      fontSize: 14,
      color: this.colors.accent,
      align: 'center'
    })
    
    // Contact information in organized layout
    const contactY = 45
    const contacts = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.website
    ].filter((item): item is string => Boolean(item))
    
    const contactWidth = (this.pageWidth - 2 * this.margin) / contacts.length
    contacts.forEach((contact, index) => {
      const x = this.margin + (index + 0.5) * contactWidth
      this.addText(contact, x, contactY, {
        fontSize: 10,
        color: '#cbd5e1',
        align: 'center'
      })
    })
    
    this.currentY = 65
  }

  private addSection(title: string) {
    this.currentY += 12
    
    // Section title with modern styling
    this.addText(title.toUpperCase(), this.margin, this.currentY, {
      fontSize: 14,
      fontStyle: 'bold',
      color: this.colors.primary
    })
    
    this.currentY += 3
    this.addSectionDivider(this.margin, this.currentY, this.pageWidth - 2 * this.margin)
    this.currentY += 8
  }

  private formatAchievement(text: string): string {
    // Highlight metrics and achievements
    return text.replace(/(\d+%|\$\d+(?:,\d+)*|\d+\+|\d+(?:,\d+)*)/g, '→ $1')
  }

  private addExperienceItem(job: { title: string; company: string; period: string; description: string[] }, x: number, y: number, width: number): number {
    let currentY = y
    
    // Job title - prominent
    this.addText(job.title, x, currentY, {
      fontSize: 14,
      fontStyle: 'bold',
      color: this.colors.primary
    })
    currentY += 7
    
    // Company and period on same line
    this.addText(job.company, x, currentY, {
      fontSize: 12,
      fontStyle: 'bold',
      color: this.colors.secondary
    })
    
    this.addText(job.period, x + width - 30, currentY, {
      fontSize: 10,
      color: this.colors.lightText,
      align: 'right'
    })
    currentY += 12
    
    // Achievements with emphasis on metrics
    job.description.forEach((desc: string) => {
      const formatted = this.formatAchievement(desc)
      const lines = this.pdf.splitTextToSize(`• ${formatted}`, width - 5)
      
      this.addText(lines, x + 3, currentY, {
        fontSize: 10,
        color: this.colors.text
      })
      currentY += lines.length * 5
    })
    
    return currentY + 8
  }

  private addSkillCategory(category: string, skills: string[], x: number, y: number, width: number): number {
    let currentY = y
    
    // Category title
    this.addText(`${category}:`, x, currentY, {
      fontSize: 11,
      fontStyle: 'bold',
      color: this.colors.primary
    })
    currentY += 6
    
    // Skills as tags
    const skillTags = skills.join(' • ')
    const lines = this.pdf.splitTextToSize(skillTags, width)
    
    this.addText(lines, x, currentY, {
      fontSize: 10,
      color: this.colors.text
    })
    
    return currentY + lines.length * 5 + 8
  }

  public generateResume(data: ResumeData): jsPDF {
    // Modern header
    this.createModernHeader(data.personalInfo)
    
    // Professional Summary with modern styling
    this.addSection('Professional Summary')
    
    // Add subtle background for summary
    const summaryHeight = 25
    this.addBackgroundRect(this.margin - 5, this.currentY - 5, this.pageWidth - 2 * this.margin + 10, summaryHeight, '#f8fafc')
    
    const summaryLines = this.pdf.splitTextToSize(data.summary, this.pageWidth - 2 * this.margin - 10)
    this.addText(summaryLines, this.margin, this.currentY, {
      fontSize: 11,
      color: this.colors.text
    })
    this.currentY += summaryLines.length * 5 + 15

    // Professional Experience
    this.addSection('Professional Experience')
    
    data.experience.forEach((job, index) => {
      this.currentY = this.addExperienceItem(job, this.margin, this.currentY, this.pageWidth - 2 * this.margin)
      
      if (index < data.experience.length - 1) {
        // Add subtle separator
        this.addLine(this.margin, this.currentY - 4, this.pageWidth - this.margin, this.currentY - 4, this.colors.divider, 0.3)
      }
    })

    // Two-column layout for Skills and Education
    this.addSection('Technical Skills & Education')
    
    const columnWidth = (this.pageWidth - 3 * this.margin) / 2
    const leftX = this.margin
    const rightX = this.margin * 2 + columnWidth
    
    let leftY = this.currentY
    let rightY = this.currentY
    
    // Skills column
    this.addText('TECHNICAL SKILLS', leftX, leftY, {
      fontSize: 12,
      fontStyle: 'bold',
      color: this.colors.secondary
    })
    leftY += 8
    
    leftY = this.addSkillCategory('Frontend', data.skills.frontend, leftX, leftY, columnWidth)
    leftY = this.addSkillCategory('Backend', data.skills.backend, leftX, leftY, columnWidth)
    leftY = this.addSkillCategory('Tools & Technologies', data.skills.tools, leftX, leftY, columnWidth)

    // Education column (if provided)
    if (data.education && data.education.length > 0) {
      this.addText('EDUCATION', rightX, rightY, {
        fontSize: 12,
        fontStyle: 'bold',
        color: this.colors.secondary
      })
      rightY += 8
      
      data.education.forEach(edu => {
        this.addText(edu.degree, rightX, rightY, {
          fontSize: 11,
          fontStyle: 'bold',
          color: this.colors.primary
        })
        rightY += 6
        
        this.addText(edu.institution, rightX, rightY, {
          fontSize: 10,
          color: this.colors.secondary
        })
        rightY += 5
        
        this.addText(edu.period, rightX, rightY, {
          fontSize: 9,
          color: this.colors.lightText
        })
        rightY += 12
      })
    }

    // Footer with modern touch
    const footerY = this.pageHeight - 15
    this.addLine(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5, this.colors.divider, 0.3)
    this.addText(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, this.pageWidth / 2, footerY, {
      fontSize: 8,
      color: this.colors.lightText,
      align: 'center'
    })

    return this.pdf
  }
}

export function downloadModernResume(data: ResumeData) {
  const generator = new ModernResumePDFGenerator()
  const pdf = generator.generateResume(data)
  pdf.save(`${data.personalInfo.name.replace(/\s+/g, '_')}_Modern_Resume.pdf`)
}