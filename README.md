# Portfolio Website

A modern, responsive portfolio website built with Vue.js 3, TypeScript, and Vite. Features a clean design, internationalization support, and automated deployment to GitHub Pages.

## 🌟 Features

- **Modern Vue.js 3** with Composition API and TypeScript
- **Responsive Design** that works on all devices
- **Internationalization (i18n)** support with Vue I18n
- **Single Page Application** with Vue Router
- **Component-based Architecture** for maintainability
- **SCSS Styling** with modern CSS features
- **Automated Testing** with Vitest
- **GitHub Pages Deployment** with GitHub Actions
- **SEO Optimized** with proper meta tags and semantic HTML
- **Accessibility Compliant** following WCAG guidelines

## 🚀 Live Demo

Visit the live website: [https://aurfi.github.io/portfolio-website/](https://aurfi.github.io/portfolio-website/)

## 🛠️ Tech Stack

- **Frontend Framework:** Vue.js 3
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** SCSS
- **State Management:** Pinia
- **Routing:** Vue Router
- **Internationalization:** Vue I18n
- **Testing:** Vitest + Vue Test Utils
- **Linting:** ESLint + Prettier
- **Deployment:** GitHub Pages + GitHub Actions

## 📦 Project Setup

### Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/Aurfi/portfolio-website.git

# Navigate to project directory
cd portfolio-website

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot reload
npm run dev

# The application will be available at http://localhost:5173
```

### Building for Production

```bash
# Type check, compile and minify for production
npm run build

# Preview the production build locally
npm run preview
```

### Testing

```bash
# Run unit tests
npm run test:unit

# Run tests in watch mode
npm run test:unit -- --watch
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Type checking
npm run type-check
```

## 🏗️ Project Structure

```
portfolio-website/
├── public/                 # Static assets
│   ├── images/            # Project images and icons
│   └── 404.html          # GitHub Pages SPA fallback
├── src/
│   ├── assets/           # Stylesheets and assets
│   ├── components/       # Vue components
│   │   ├── layout/       # Layout components
│   │   ├── sections/     # Page sections
│   │   └── ui/          # Reusable UI components
│   ├── composables/      # Vue composables
│   ├── locales/         # i18n translation files
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia stores
│   ├── types/           # TypeScript type definitions
│   └── views/           # Page components
├── .github/
│   └── workflows/       # GitHub Actions workflows
└── dist/               # Production build output
```

## 🌐 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow:

1. **Triggers** on push to the `main` branch
2. **Builds** the project with production optimizations
3. **Tests** the code with unit tests and linting
4. **Deploys** to GitHub Pages automatically

### Manual Deployment

You can also deploy manually:

```bash
# Build the project
npm run build

# The dist/ folder contains the production build
# Upload the contents to your hosting provider
```

## 🎨 Customization

### Styling

- Global styles are in `src/assets/styles/`
- Component styles use SCSS with scoped styling
- CSS variables are defined in `src/assets/styles/variables.scss`

### Content

- Update personal information in the Vue components
- Modify translations in `src/locales/en.json`
- Add your projects in the projects data structure

### Configuration

- Vite configuration: `vite.config.ts`
- TypeScript configuration: `tsconfig.json`
- ESLint configuration: `eslint.config.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Vue.js](https://vuejs.org/)
- Styled with [SCSS](https://sass-lang.com/)
- Deployed on [GitHub Pages](https://pages.github.com/)
- **Created with AI assistance** for rapid development and best practices

---

**Note:** This portfolio website was created by an AI to demonstrate modern web development practices and efficient project setup.