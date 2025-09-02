import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export interface ResumeData {
  personalInfo: {
    name: string
    title: string
    email: string
    phone: string
    location: string
    website: string
  }
  summary: string
  experience: Array<{
    title: string
    company: string
    date: string
    description: string
    achievements: string[]
  }>
  education: Array<{
    degree: string
    school: string
    date: string
    details?: string
  }>
  skills: Array<{
    category: string
    items: string[]
  }>
  certifications?: Array<{
    name: string
    issuer: string
    date: string
  }>
}

export function useResumeGenerator() {
  const generateResumePDF = async (data: ResumeData): Promise<void> => {
    try {
      // Create a temporary HTML element for the resume
      const resumeElement = createResumeHTML(data)
      document.body.appendChild(resumeElement)

      // Convert to canvas
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
      })

      // Remove temporary element
      document.body.removeChild(resumeElement)

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')

      // Calculate dimensions to fit A4
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)

      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)

      // Download the PDF
      pdf.save(`${data.personalInfo.name.replace(/\\s+/g, '_')}_Resume.pdf`)
    } catch (error) {
      console.error('Error generating resume PDF:', error)
      throw new Error('Failed to generate resume PDF')
    }
  }

  const createResumeHTML = (data: ResumeData): HTMLElement => {
    const resumeDiv = document.createElement('div')
    resumeDiv.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: 794px;
      background: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      color: #333;
      padding: 40px;
      box-sizing: border-box;
    `

    resumeDiv.innerHTML = `
      <div style="margin-bottom: 30px; text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px;">
        <h1 style="margin: 0 0 5px 0; font-size: 28px; color: #2563eb; font-weight: 700;">${data.personalInfo.name}</h1>
        <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #64748b; font-weight: 400;">${data.personalInfo.title}</h2>
        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; font-size: 12px; color: #64748b;">
          <span>${data.personalInfo.email}</span>
          <span>${data.personalInfo.phone}</span>
          <span>${data.personalInfo.location}</span>
          <span>${data.personalInfo.website}</span>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #2563eb; font-weight: 600; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Professional Summary</h3>
        <p style="margin: 0; text-align: justify;">${data.summary}</p>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #2563eb; font-weight: 600; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Professional Experience</h3>
        ${data.experience
          .map(
            (exp) => `
          <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;">
              <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #1e293b;">${exp.title}</h4>
              <span style="font-size: 12px; color: #64748b; font-weight: 500;">${exp.date}</span>
            </div>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #2563eb; font-weight: 500;">${exp.company}</p>
            <p style="margin: 0 0 8px 0; font-size: 13px; text-align: justify;">${exp.description}</p>
            ${
              exp.achievements.length > 0
                ? `
              <ul style="margin: 0; padding-left: 20px; font-size: 12px;">
                ${exp.achievements.map((achievement) => `<li style="margin-bottom: 3px;">${achievement}</li>`).join('')}
              </ul>
            `
                : ''
            }
          </div>
        `
          )
          .join('')}
      </div>

      <div style="display: flex; gap: 30px;">
        <div style="flex: 1;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #2563eb; font-weight: 600; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Education</h3>
          ${data.education
            .map(
              (edu) => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px;">
                <h4 style="margin: 0; font-size: 13px; font-weight: 600; color: #1e293b;">${edu.degree}</h4>
                <span style="font-size: 11px; color: #64748b;">${edu.date}</span>
              </div>
              <p style="margin: 0; font-size: 12px; color: #2563eb;">${edu.school}</p>
              ${edu.details ? `<p style="margin: 3px 0 0 0; font-size: 11px; color: #64748b;">${edu.details}</p>` : ''}
            </div>
          `
            )
            .join('')}
        </div>

        <div style="flex: 1;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #2563eb; font-weight: 600; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Technical Skills</h3>
          ${data.skills
            .map(
              (skillGroup) => `
            <div style="margin-bottom: 12px;">
              <h4 style="margin: 0 0 5px 0; font-size: 12px; font-weight: 600; color: #1e293b;">${skillGroup.category}</h4>
              <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.3;">${skillGroup.items.join(', ')}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      ${
        data.certifications && data.certifications.length > 0
          ? `
        <div style="margin-top: 25px;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #2563eb; font-weight: 600; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Certifications</h3>
          ${data.certifications
            .map(
              (cert) => `
            <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: baseline;">
              <div>
                <span style="font-size: 13px; font-weight: 600; color: #1e293b;">${cert.name}</span>
                <span style="font-size: 12px; color: #2563eb; margin-left: 10px;">${cert.issuer}</span>
              </div>
              <span style="font-size: 11px; color: #64748b;">${cert.date}</span>
            </div>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }
    `

    return resumeDiv
  }

  const getDefaultResumeData = (): ResumeData => ({
    personalInfo: {
      name: 'John Developer',
      title: 'Full-Stack Developer & Software Engineer',
      email: 'john.developer@example.com',
      phone: '+1 (555) 123-4567',
      location: 'Your City, Country',
      website: 'www.johndeveloper.com',
    },
    summary:
      'Passionate full-stack developer with 5+ years of experience building scalable web applications and digital solutions. Expertise in modern JavaScript frameworks, backend development, and creating exceptional user experiences. Proven track record of delivering high-quality projects on time and collaborating effectively with cross-functional teams.',
    experience: [
      {
        title: 'Senior Full Stack Developer',
        company: 'Tech Solutions Inc.',
        date: '2023 - Present',
        description:
          'Leading development of enterprise applications using modern web technologies and microservices architecture.',
        achievements: [
          'Architected and developed 5+ enterprise applications serving 10,000+ users',
          'Improved application performance by 40% through optimization and caching strategies',
          'Mentored junior developers and established coding standards for the team',
          'Implemented CI/CD pipelines reducing deployment time by 60%',
        ],
      },
      {
        title: 'Frontend Developer',
        company: 'Digital Agency Co.',
        date: '2021 - 2023',
        description:
          'Developed responsive web applications and collaborated with design teams to create exceptional user experiences.',
        achievements: [
          'Built 15+ responsive websites with 98% client satisfaction rate',
          'Reduced page load times by 50% through performance optimization',
          'Collaborated with UX/UI designers to implement pixel-perfect designs',
          'Integrated third-party APIs and payment systems for e-commerce platforms',
        ],
      },
      {
        title: 'Junior Developer',
        company: 'StartUp Ventures',
        date: '2019 - 2021',
        description:
          'Built web applications from scratch and gained experience in full-stack development and agile methodologies.',
        achievements: [
          'Developed MVP for 3 startup products using modern web technologies',
          'Participated in agile development process and daily standups',
          'Learned and implemented best practices for code quality and testing',
          'Contributed to open-source projects and technical documentation',
        ],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of Technology',
        date: '2015 - 2019',
        details: 'Graduated Magna Cum Laude, GPA: 3.8/4.0',
      },
      {
        degree: 'Full Stack Web Development Bootcamp',
        school: 'Coding Academy',
        date: '2019',
        details: 'Intensive 6-month program covering modern web technologies',
      },
    ],
    skills: [
      {
        category: 'Frontend',
        items: [
          'Vue.js',
          'React',
          'TypeScript',
          'JavaScript',
          'HTML5',
          'CSS3',
          'SCSS',
          'Tailwind CSS',
        ],
      },
      {
        category: 'Backend',
        items: [
          'Node.js',
          'Express.js',
          'Spring Boot',
          'Java',
          'Python',
          'PostgreSQL',
          'MongoDB',
          'Redis',
        ],
      },
      {
        category: 'DevOps & Tools',
        items: ['Docker', 'AWS', 'Git', 'GitHub Actions', 'Jenkins', 'Nginx', 'Linux', 'Webpack'],
      },
      {
        category: 'Testing & Quality',
        items: [
          'Jest',
          'Cypress',
          'Vitest',
          'ESLint',
          'Prettier',
          'SonarQube',
          'Unit Testing',
          'E2E Testing',
        ],
      },
    ],
    certifications: [
      {
        name: 'AWS Certified Developer - Associate',
        issuer: 'Amazon Web Services',
        date: '2023',
      },
      {
        name: 'Vue.js Certified Developer',
        issuer: 'Vue.js Foundation',
        date: '2022',
      },
    ],
  })

  return {
    generateResumePDF,
    getDefaultResumeData,
  }
}
