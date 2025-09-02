// Core Types for Portfolio Application

export interface LocalizedString {
  [languageCode: string]: string
  en: string // English as default
}

export interface Project {
  id: string
  title: LocalizedString
  description: LocalizedString
  shortDescription: LocalizedString
  technologies: string[]
  category: ProjectCategory
  demoUrl: string
  repositoryUrl?: string
  isExternal: boolean
  screenshots: string[]
  featured: boolean
  completionDate: Date
  developmentDuration: string // e.g., "3 months"
  highlights: { [languageCode: string]: string[] }
  complexity: ProjectComplexity
}

export interface ProjectCategory {
  id: string
  name: LocalizedString
  color: string
  icon: string
}

export interface ProjectComplexity {
  level: 'simple' | 'intermediate' | 'complex' | 'enterprise'
  indicators: string[] // Features that show complexity
  linesOfCode?: number
  teamSize?: number
}

export interface DeveloperProfile {
  name: string
  email: string
  title: LocalizedString
  bio: LocalizedString
  experience: Experience[]
  education: Education[]
  skills: SkillSet[]
  certifications: Certification[]
}

export interface Experience {
  company: string
  position: LocalizedString
  duration: string
  description: LocalizedString
  technologies: string[]
}

export interface Education {
  institution: string
  degree: LocalizedString
  field: LocalizedString
  duration: string
  description?: LocalizedString
}

export interface SkillSet {
  category: LocalizedString
  skills: Skill[]
}

export interface Skill {
  name: string
  level: SkillLevel
  yearsOfExperience: number
}

export interface Certification {
  name: LocalizedString
  issuer: string
  date: Date
  credentialId?: string
  credentialUrl?: string
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export type SupportedLocale = 'en' // Will be extended later

export interface NavigationItem {
  name: string
  path: string
  translationKey: string
}
