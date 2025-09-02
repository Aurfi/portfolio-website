export interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone?: string
    location: string
    website?: string
    linkedin?: string
    github?: string
  }
  summary: string
  experience: Array<{
    title: string
    company: string
    period: string
    description: string[]
  }>
  skills: {
    frontend: string[]
    backend: string[]
    tools: string[]
  }
  education?: Array<{
    degree: string
    institution: string
    period: string
  }>
}

export const resumeData: ResumeData = {
  personalInfo: {
    name: 'John Developer',
    email: 'john.developer@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'johndeveloper.dev',
    linkedin: 'linkedin.com/in/johndeveloper',
    github: 'github.com/johndeveloper'
  },
  summary: 'Full-stack developer with 5+ years of experience building scalable web applications. Expertise in modern JavaScript frameworks, backend development, and creating exceptional user experiences. Passionate about clean code and innovative solutions.',
  experience: [
    {
      title: 'Senior Full-Stack Developer',
      company: 'TechCorp Solutions',
      period: '2022 - Present',
      description: [
        'Lead development of scalable web applications using Vue.js and Spring Boot',
        'Mentor junior developers and implement best practices for code quality',
        'Improved application performance by 40% through optimization techniques',
        'Collaborate with cross-functional teams to deliver high-quality products'
      ]
    },
    {
      title: 'Full-Stack Developer',
      company: 'InnovateLabs',
      period: '2020 - 2022',
      description: [
        'Developed and maintained multiple client projects using modern web technologies',
        'Collaborated with designers and product managers to deliver exceptional UX',
        'Built responsive applications serving 50k+ monthly active users',
        'Implemented CI/CD pipelines reducing deployment time by 60%'
      ]
    },
    {
      title: 'Frontend Developer',
      company: 'StartupVenture',
      period: '2019 - 2020',
      description: [
        'Built responsive web applications and contributed to design system',
        'Gained experience in agile development and cross-functional collaboration',
        'Reduced page load times by 30% through performance optimizations',
        'Created reusable component library adopted across 5 projects'
      ]
    }
  ],
  skills: {
    frontend: ['Vue.js', 'React', 'TypeScript', 'SCSS', 'Tailwind CSS'],
    backend: ['Node.js', 'Spring Boot', 'PostgreSQL', 'Redis', 'REST APIs'],
    tools: ['Docker', 'AWS', 'Git', 'Figma', 'VS Code']
  },
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Technology',
      period: '2015 - 2019'
    }
  ]
}