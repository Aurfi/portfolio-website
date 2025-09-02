import { describe, it, expect } from 'vitest'
import { projects, projectCategories, getFeaturedProjects, getProjectsByCategory, getProjectById } from '../projects'

describe('Projects Data', () => {
  it('has valid project structure', () => {
    expect(projects).toBeDefined()
    expect(Array.isArray(projects)).toBe(true)
    expect(projects.length).toBeGreaterThan(0)
  })

  it('all projects have required fields', () => {
    projects.forEach(project => {
      expect(project.id).toBeDefined()
      expect(project.title.en).toBeDefined()
      expect(project.description.en).toBeDefined()
      expect(project.shortDescription.en).toBeDefined()
      expect(Array.isArray(project.technologies)).toBe(true)
      expect(project.category).toBeDefined()
      expect(project.demoUrl).toBeDefined()
      expect(typeof project.isExternal).toBe('boolean')
      expect(Array.isArray(project.screenshots)).toBe(true)
      expect(typeof project.featured).toBe('boolean')
      expect(project.completionDate instanceof Date).toBe(true)
      expect(project.developmentDuration).toBeDefined()
      expect(project.highlights.en).toBeDefined()
      expect(Array.isArray(project.highlights.en)).toBe(true)
      expect(project.complexity).toBeDefined()
    })
  })

  it('has valid project categories', () => {
    expect(projectCategories).toBeDefined()
    expect(Array.isArray(projectCategories)).toBe(true)
    expect(projectCategories.length).toBeGreaterThan(0)
    
    projectCategories.forEach(category => {
      expect(category.id).toBeDefined()
      expect(category.name.en).toBeDefined()
      expect(category.color).toBeDefined()
      expect(category.icon).toBeDefined()
    })
  })

  it('getFeaturedProjects returns only featured projects', () => {
    const featured = getFeaturedProjects()
    expect(Array.isArray(featured)).toBe(true)
    featured.forEach(project => {
      expect(project.featured).toBe(true)
    })
  })

  it('getProjectsByCategory filters correctly', () => {
    const allProjects = getProjectsByCategory('all')
    expect(allProjects).toEqual(projects)
    
    const webApps = getProjectsByCategory('web-app')
    webApps.forEach(project => {
      expect(project.category.id).toBe('web-app')
    })
  })

  it('getProjectById returns correct project', () => {
    const firstProject = projects[0]
    const foundProject = getProjectById(firstProject.id)
    expect(foundProject).toEqual(firstProject)
    
    const nonExistent = getProjectById('non-existent-id')
    expect(nonExistent).toBeUndefined()
  })

  it('all project IDs are unique', () => {
    const ids = projects.map(p => p.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('all projects have valid complexity levels', () => {
    const validLevels = ['simple', 'intermediate', 'complex', 'enterprise']
    projects.forEach(project => {
      expect(validLevels).toContain(project.complexity.level)
      expect(Array.isArray(project.complexity.indicators)).toBe(true)
      expect(project.complexity.indicators.length).toBeGreaterThan(0)
    })
  })
})