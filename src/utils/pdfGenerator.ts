import jsPDF from 'jspdf'
import type { ResumeData } from './resumeData'

export class ResumePDFGenerator {
  private pdf: jsPDF
  private currentY: number = 0
  private pageWidth: number
  private margin: number = 20
  private primaryColor: string = '#3b82f6' // Website primary blue
  private textColor: string = '#1f2937'
  private lightGray: string = '#6b7280'

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

  private addText(text: string, x: number, y: number, options: {
    fontSize?: number
    fontStyle?: 'normal' | 'bold'
    color?: string
    align?: 'left' | 'center' | 'right'
    maxWidth?: number
  } = {}) {
    const {
      fontSize = 10,
      fontStyle = 'normal',
      color = this.textColor,
      align = 'left',
      maxWidth
    } = options

    this.pdf.setFontSize(fontSize)
    this.pdf.setFont('helvetica', fontStyle)
    this.pdf.setTextColor(color)

    if (maxWidth) {
      const lines = this.pdf.splitTextToSize(text, maxWidth)
      this.pdf.text(lines, x, y, { align })
      return lines.length * (fontSize * 0.35) // Approximate line height
    } else {
      this.pdf.text(text, x, y, { align })
      return fontSize * 0.35
    }
  }

  private addLine(startX: number, startY: number, endX: number, endY: number, color: string = this.lightGray) {
    this.pdf.setDrawColor(color)
    this.pdf.setLineWidth(0.5)
    this.pdf.line(startX, startY, endX, endY)
  }

  private addGradientHeader(startY: number, height: number) {
    // Create a subtle background header section
    this.pdf.setFillColor(248, 250, 252) // Very light background
    this.pdf.rect(0, startY, this.pageWidth, height, 'F')
    
    // Add a subtle border at bottom
    this.pdf.setDrawColor(this.primaryColor)
    this.pdf.setLineWidth(2)
    this.pdf.line(this.margin, startY + height - 1, this.pageWidth - this.margin, startY + height - 1)
  }


  private addSection(title: string) {
    this.currentY += 8
    this.addText(title.toUpperCase(), this.margin, this.currentY, {
      fontSize: 12,
      fontStyle: 'bold',
      color: this.primaryColor
    })
    this.currentY += 3
    this.addLine(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY, this.primaryColor)
    this.currentY += 5
  }

  public generateResume(data: ResumeData): jsPDF {
    // Header background
    this.addGradientHeader(0, 40)
    
    // Header with name
    this.currentY = this.margin + 5
    this.addText(data.personalInfo.name, this.pageWidth / 2, this.currentY, {
      fontSize: 24,
      fontStyle: 'bold',
      color: this.primaryColor,
      align: 'center'
    })

    // Contact information
    this.currentY += 20
    const contactInfo = [
      data.personalInfo.email,
      data.personalInfo.phone,
      data.personalInfo.location,
      data.personalInfo.website
    ].filter(Boolean).join(' | ')

    this.addText(contactInfo, this.pageWidth / 2, this.currentY, {
      fontSize: 10,
      align: 'center',
      color: this.textColor
    })

    // Professional Summary
    this.currentY += 5
    this.addSection('Professional Summary')
    const summaryHeight = this.addText(data.summary, this.margin, this.currentY, {
      fontSize: 10,
      maxWidth: this.pageWidth - 2 * this.margin
    })
    this.currentY += summaryHeight + 2

    // Experience
    this.addSection('Professional Experience')
    
    data.experience.forEach((job) => {
      // Add subtle background for each job entry
      const entryHeight = 2 + job.description.length * 4 + 8
      this.pdf.setFillColor(248, 250, 252)
      this.pdf.roundedRect(this.margin - 2, this.currentY - 2, this.pageWidth - 2 * this.margin + 4, entryHeight, 2, 2, 'F')
      
      // Job title and period on same line
      this.addText(job.title, this.margin, this.currentY, {
        fontSize: 11,
        fontStyle: 'bold',
        color: this.textColor
      })
      
      this.addText(job.period, this.pageWidth - this.margin, this.currentY, {
        fontSize: 9,
        color: this.lightGray,
        align: 'right'
      })
      
      this.currentY += 4
      this.addText(job.company, this.margin, this.currentY, {
        fontSize: 10,
        fontStyle: 'bold',
        color: this.primaryColor
      })
      this.currentY += 4

      // Job description with better formatting
      job.description.forEach(point => {
        this.addText(`• ${point}`, this.margin + 3, this.currentY, {
          fontSize: 9,
          color: this.textColor,
          maxWidth: this.pageWidth - 2 * this.margin - 3
        })
        this.currentY += 3.5
      })

      this.currentY += 3
    })

    // Skills
    this.addSection('Technical Skills')
    
    const skillCategories = [
      { label: 'Frontend', skills: data.skills.frontend },
      { label: 'Backend', skills: data.skills.backend },
      { label: 'Tools & Technologies', skills: data.skills.tools }
    ]

    skillCategories.forEach(category => {
      this.addText(`${category.label}:`, this.margin, this.currentY, {
        fontSize: 10,
        fontStyle: 'bold'
      })
      
      this.addText(category.skills.join(', '), this.margin + 25, this.currentY, {
        fontSize: 10,
        maxWidth: this.pageWidth - this.margin - 30
      })
      this.currentY += 5
    })

    // Education (if provided)
    if (data.education && data.education.length > 0) {
      this.addSection('Education')
      
      data.education.forEach(edu => {
        this.addText(edu.degree, this.margin, this.currentY, {
          fontSize: 11,
          fontStyle: 'bold'
        })
        
        this.addText(edu.period, this.pageWidth - this.margin, this.currentY, {
          fontSize: 10,
          color: this.lightGray,
          align: 'right'
        })
        
        this.currentY += 4
        this.addText(edu.institution, this.margin, this.currentY, {
          fontSize: 10,
          color: this.primaryColor
        })
        this.currentY += 6
      })
    }

    return this.pdf
  }
}

export function downloadResume(data: ResumeData) {
  const generator = new ResumePDFGenerator()
  const pdf = generator.generateResume(data)
  pdf.save(`${data.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`)
}