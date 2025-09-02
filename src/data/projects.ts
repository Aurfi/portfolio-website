import type { Project, ProjectCategory } from '@/types'

// Project Categories
export const projectCategories: ProjectCategory[] = [
  {
    id: 'all',
    name: { en: 'All Projects' },
    color: '#6c757d',
    icon: 'grid',
  },
  {
    id: 'web-app',
    name: { en: 'Web Applications' },
    color: '#3498db',
    icon: 'globe',
  },
  {
    id: 'mobile',
    name: { en: 'Mobile & PWA' },
    color: '#e74c3c',
    icon: 'smartphone',
  },
  {
    id: 'backend',
    name: { en: 'Backend & API' },
    color: '#27ae60',
    icon: 'server',
  },
  {
    id: 'frontend',
    name: { en: 'Frontend Showcase' },
    color: '#f39c12',
    icon: 'layout',
  },
]

// Mock Projects Data
export const projects: Project[] = [
  {
    id: 'business-app',
    title: { en: 'Enterprise Business Application' },
    description: {
      en: 'A comprehensive business management system built with microservices architecture. Features include order management, inventory tracking, customer relationship management, and real-time analytics dashboard. The application demonstrates enterprise-level patterns including CQRS, event sourcing, and distributed caching.',
    },
    shortDescription: {
      en: 'Enterprise-grade business management system with microservices architecture and real-time analytics.',
    },
    technologies: ['Spring Boot', 'Vue.js', 'PostgreSQL', 'Docker', 'Redis', 'JWT', 'REST API'],
    category: projectCategories.find((c) => c.id === 'backend')!,
    demoUrl: '/business-demo',
    repositoryUrl: 'https://gitlab.com/johndeveloper/business-app',
    isExternal: false,
    screenshots: [
      '/images/projects/business-app/dashboard.jpg',
      '/images/projects/business-app/orders.jpg',
      '/images/projects/business-app/analytics.jpg',
    ],
    featured: true,
    completionDate: new Date('2024-11-15'),
    developmentDuration: '4 months',
    highlights: {
      en: [
        'Microservices architecture with 5+ independent services',
        'Real-time dashboard with WebSocket integration',
        'Advanced role-based access control (RBAC)',
        'Comprehensive test coverage (85%+)',
        'CI/CD pipeline with automated deployment',
      ],
    },
    complexity: {
      level: 'enterprise',
      indicators: [
        'Microservices Architecture',
        'Event-Driven Design',
        'Distributed Caching',
        'Advanced Security',
        'Real-time Features',
      ],
      linesOfCode: 15000,
      teamSize: 1,
    },
  },
  {
    id: 'frontend-showcase',
    title: { en: 'Modern Frontend Showcase' },
    description: {
      en: 'An interactive demonstration of advanced Vue.js 3 patterns and modern frontend development techniques. Features component composition, state management with Pinia, real-time updates, advanced animations, and responsive design patterns. Showcases best practices in TypeScript, testing, and performance optimization.',
    },
    shortDescription: {
      en: 'Interactive Vue.js 3 showcase demonstrating advanced patterns and modern frontend techniques.',
    },
    technologies: ['Vue.js 3', 'TypeScript', 'Pinia', 'Vite', 'SCSS', 'WebSocket', 'Jest'],
    category: projectCategories.find((c) => c.id === 'frontend')!,
    demoUrl: '/frontend-demo',
    repositoryUrl: 'https://github.com/johndeveloper/frontend-showcase',
    isExternal: false,
    screenshots: [
      '/images/projects/frontend-showcase/components.jpg',
      '/images/projects/frontend-showcase/animations.jpg',
      '/images/projects/frontend-showcase/dashboard.jpg',
    ],
    featured: true,
    completionDate: new Date('2024-10-20'),
    developmentDuration: '2.5 months',
    highlights: {
      en: [
        'Advanced Vue.js 3 Composition API patterns',
        'Custom component library with 20+ components',
        'Real-time data synchronization',
        'Smooth animations and micro-interactions',
        'Comprehensive TypeScript integration',
      ],
    },
    complexity: {
      level: 'complex',
      indicators: [
        'Advanced Component Patterns',
        'State Management',
        'Real-time Features',
        'Animation System',
        'TypeScript Integration',
      ],
      linesOfCode: 8500,
      teamSize: 1,
    },
  },
  {
    id: 'mobile-pwa',
    title: { en: 'Progressive Web Application' },
    description: {
      en: 'A mobile-first Progressive Web App for food ordering with offline capabilities, push notifications, and native-like user experience. Built with modern web technologies to deliver app-store quality experience directly in the browser. Features include offline ordering, payment integration, and location-based services.',
    },
    shortDescription: {
      en: 'Mobile-first PWA with offline capabilities and native-like user experience for food ordering.',
    },
    technologies: ['PWA', 'Hono.js', 'IndexedDB', 'Service Worker', 'WebPush', 'Stripe API'],
    category: projectCategories.find((c) => c.id === 'mobile')!,
    demoUrl: '/mobile-demo',
    repositoryUrl: 'https://github.com/johndeveloper/mobile-pwa',
    isExternal: false,
    screenshots: [
      '/images/projects/mobile-pwa/menu.jpg',
      '/images/projects/mobile-pwa/cart.jpg',
      '/images/projects/mobile-pwa/offline.jpg',
    ],
    featured: true,
    completionDate: new Date('2024-12-01'),
    developmentDuration: '3 months',
    highlights: {
      en: [
        'Full offline functionality with IndexedDB',
        'Push notifications for order updates',
        'Native-like gestures and animations',
        'Integrated payment processing',
        'Location-based restaurant discovery',
      ],
    },
    complexity: {
      level: 'complex',
      indicators: [
        'PWA Technologies',
        'Offline Capabilities',
        'Payment Integration',
        'Push Notifications',
        'Location Services',
      ],
      linesOfCode: 6800,
      teamSize: 1,
    },
  },
  {
    id: 'modern-website',
    title: { en: 'Modern Content Management System' },
    description: {
      en: 'A full-stack content management system built with Hono.js and modern web technologies. Features include dynamic content creation, SEO optimization, performance monitoring, and external API integrations. Demonstrates modern web development practices with server-side rendering and edge computing.',
    },
    shortDescription: {
      en: 'Full-stack CMS with modern web technologies, SEO optimization, and performance monitoring.',
    },
    technologies: ['Hono.js', 'PostgreSQL', 'TypeScript', 'Tailwind CSS', 'Cloudflare Workers'],
    category: projectCategories.find((c) => c.id === 'web-app')!,
    demoUrl: '/website-demo',
    repositoryUrl: 'https://github.com/johndeveloper/modern-website',
    isExternal: false,
    screenshots: [
      '/images/projects/modern-website/cms.jpg',
      '/images/projects/modern-website/blog.jpg',
      '/images/projects/modern-website/analytics.jpg',
    ],
    featured: true,
    completionDate: new Date('2024-09-30'),
    developmentDuration: '2 months',
    highlights: {
      en: [
        'Edge-first architecture with Cloudflare Workers',
        'Advanced SEO optimization and meta management',
        'Real-time content preview and editing',
        'Performance monitoring and analytics',
        'Multi-language content support',
      ],
    },
    complexity: {
      level: 'intermediate',
      indicators: [
        'Edge Computing',
        'SEO Optimization',
        'Content Management',
        'Performance Monitoring',
        'API Integrations',
      ],
      linesOfCode: 5200,
      teamSize: 1,
    },
  },
  {
    id: 'e-commerce-platform',
    title: { en: 'E-Commerce Platform' },
    description: {
      en: 'A scalable e-commerce platform with advanced features including product catalog management, shopping cart, payment processing, order tracking, and admin dashboard. Built with modern architecture patterns and optimized for performance and security.',
    },
    shortDescription: {
      en: 'Scalable e-commerce platform with advanced features and modern architecture patterns.',
    },
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Redis', 'Docker'],
    category: projectCategories.find((c) => c.id === 'web-app')!,
    demoUrl: 'https://ecommerce-demo.example.com',
    repositoryUrl: 'https://github.com/johndeveloper/ecommerce-platform',
    isExternal: true,
    screenshots: [
      '/images/projects/ecommerce/storefront.jpg',
      '/images/projects/ecommerce/admin.jpg',
      '/images/projects/ecommerce/checkout.jpg',
    ],
    featured: false,
    completionDate: new Date('2024-08-15'),
    developmentDuration: '5 months',
    highlights: {
      en: [
        'Multi-vendor marketplace functionality',
        'Advanced search and filtering',
        'Real-time inventory management',
        'Secure payment processing',
        'Comprehensive admin dashboard',
      ],
    },
    complexity: {
      level: 'enterprise',
      indicators: [
        'Multi-vendor Architecture',
        'Payment Processing',
        'Inventory Management',
        'Security Features',
        'Scalable Design',
      ],
      linesOfCode: 18000,
      teamSize: 1,
    },
  },
  {
    id: 'task-management',
    title: { en: 'Collaborative Task Management' },
    description: {
      en: 'A collaborative task management application with real-time updates, team collaboration features, project tracking, and advanced reporting. Features include drag-and-drop interfaces, time tracking, file attachments, and integration with popular productivity tools.',
    },
    shortDescription: {
      en: 'Collaborative task management with real-time updates and team collaboration features.',
    },
    technologies: ['React', 'Express.js', 'Socket.io', 'PostgreSQL', 'AWS S3'],
    category: projectCategories.find((c) => c.id === 'web-app')!,
    demoUrl: 'https://taskmanager-demo.example.com',
    repositoryUrl: 'https://github.com/johndeveloper/task-management',
    isExternal: true,
    screenshots: [
      '/images/projects/taskmanager/board.jpg',
      '/images/projects/taskmanager/timeline.jpg',
      '/images/projects/taskmanager/reports.jpg',
    ],
    featured: false,
    completionDate: new Date('2024-07-10'),
    developmentDuration: '3.5 months',
    highlights: {
      en: [
        'Real-time collaboration with Socket.io',
        'Drag-and-drop task management',
        'Advanced reporting and analytics',
        'File upload and management',
        'Third-party integrations',
      ],
    },
    complexity: {
      level: 'complex',
      indicators: [
        'Real-time Collaboration',
        'File Management',
        'Advanced UI/UX',
        'Third-party APIs',
        'Data Analytics',
      ],
      linesOfCode: 12000,
      teamSize: 1,
    },
  },
]

// Helper functions
export const getFeaturedProjects = () => projects.filter((p) => p.featured)
export const getProjectsByCategory = (categoryId: string) =>
  categoryId === 'all' ? projects : projects.filter((p) => p.category.id === categoryId)
export const getProjectById = (id: string) => projects.find((p) => p.id === id)
