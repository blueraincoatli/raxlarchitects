# AGENTS.md - RA Architects Website

This document provides comprehensive guidance for AI coding agents working on the RA Architects website project.

## Project Overview

RA Architects (锐点建筑设计) Website is a modern React Single Page Application (SPA) showcasing architectural projects for Shanghai RA Architects Co., Ltd. The website features bilingual content (Chinese/English), progressive image loading, and a dark-themed design aesthetic.

**Website URL**: Not specified (deployed to Cloudflare Pages)

### Key Features
- Bilingual support (Chinese/English) with language persistence
- Progressive image loading (AVIF → WebP → JPG fallback)
- Project gallery with filtering by status and category
- Responsive design for desktop and mobile
- Project search functionality
- Partner/team member profiles

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | 18.3.1 |
| Router | React Router DOM | 6.26.2 |
| Build Tool | Vite | 5.2.0 |
| Styling | Tailwind CSS | CDN |
| Language | JavaScript (ES Modules) | - |
| Package Manager | npm | - |

### Why Tailwind CSS via CDN?
Tailwind is loaded via CDN in `index.html` for zero build-step styling. Custom configuration is done via the `<script>tailwind.config</script>` block.

## Project Structure

```
raxlarchitects/
├── index.html                 # Vite entry HTML, Tailwind CDN config
├── package.json               # Dependencies and npm scripts
├── vite.config.js             # Vite configuration with path aliases
├── wrangler.jsonc             # Cloudflare Pages deployment config
│
├── src/
│   ├── main.jsx              # React app entry, LanguageProvider wrapper
│   ├── App.jsx               # Route definitions with BrowserRouter
│   ├── index.css             # Tailwind directives + custom styles
│   ├── i18n.jsx              # Bilingual support context and utilities
│   │
│   ├── components/
│   │   ├── Navigation.jsx    # Site navigation with mobile menu, search
│   │   └── PictureImage.jsx  # Progressive image component
│   │
│   ├── pages/
│   │   ├── HomePage.jsx           # Hero carousel (desktop/mobile variants)
│   │   ├── ProjectsPage.jsx       # Featured projects grid
│   │   ├── AllProjectsPage.jsx    # Complete project listing
│   │   ├── ProjectDetailPage.jsx  # Individual project gallery
│   │   ├── UnderConstructionPage.jsx  # Redirects to /projects?status=under-construction
│   │   ├── ProposedProjectsPage.jsx   # Redirects to /projects?status=proposed
│   │   ├── AboutPage.jsx          # About, partners, awards (tab-based)
│   │   ├── PartnerDetailPage.jsx  # Individual partner profile
│   │   └── ContactPage.jsx        # Contact information
│   │
│   ├── content/
│   │   ├── projects.js            # Project data array (11 projects)
│   │   └── projects-display-config.js  # Display priorities and limits
│   │
│   └── styles/                    # (Empty - styles use Tailwind)
│
├── images/                        # Static image assets
│   ├── home/                      # Hero carousel images (desktop + mobile)
│   ├── projects/                  # Project thumbnails and galleries
│   └── about/                     # About page images
│
├── scripts/                       # Build utility scripts
│   ├── compress-images.js         # Generate AVIF/WebP/JPG variants (requires FFmpeg)
│   ├── compress-projects-root.js  # Process project root images
│   └── copy-images-to-dist.mjs    # Post-build image copy (Node.js)
│
├── docs/                          # Documentation
│   ├── source-asset-map.md        # Maps source materials to runtime paths
│   ├── english-mapping-status.md  # Translation status tracking
│   └── project-text-checklist.md  # Content checklist
│
└── 20260212-网站资料整理/          # Source reference materials (not runtime)
```

## Build, Development, and Deployment

### Available Commands

```bash
# Development
npm run dev              # Start dev server (port 3000, auto-opens browser)

# Production Build
npm run build            # Build to dist/ + copy images
npm run preview          # Preview production build locally
npm run serve            # Serve dist/ on port 8080 (npx serve)

# Utilities
npm run check            # Syntax check JS/JSX files
```

### Build Process
1. Vite bundles React app to `dist/`
2. `scripts/copy-images-to-dist.mjs` copies `images/` to `dist/images/`
3. Output is ready for deployment

### Deployment
- **Platform**: Cloudflare Pages
- **Config**: `wrangler.jsonc`
- **SPA Mode**: Enabled (`not_found_handling: "single-page-application"`)
- **Build Output**: `dist/`

## Architecture Patterns

### Routing Structure
| Route | Component | Notes |
|-------|-----------|-------|
| `/` | HomePage | Hero carousel with auto-play |
| `/projects` | ProjectsPage | Featured projects with filters |
| `/all-projects` | AllProjectsPage | Complete project listing |
| `/projects/:id` | ProjectDetailPage | Individual project gallery |
| `/under-construction` | Navigate | Redirects to `/projects?status=under-construction` |
| `/proposed` | Navigate | Redirects to `/projects?status=proposed` |
| `/about` | AboutPage | Query param: `?tab=partners` or `?tab=awards` |
| `/about/partners/:id` | PartnerDetailPage | Individual partner profile |
| `/contact` | ContactPage | Contact information |

### Internationalization (i18n)

The app uses a custom React Context for bilingual support (`src/i18n.jsx`):

```javascript
// Using the language hook
const { lang, setLang, t } = useLanguage();

// Switch language
setLang('zh'); // or 'en'

// Translate keys
t('nav.home');        // Returns "首页" or "HOME"
t('common.loading');  // Returns "加载中..." or "Loading..."
```

**Key Utilities:**
- `useLanguage()` - Hook for language state and translator
- `getProjectName(project, lang)` - Get localized project name
- `getProjectLocation(project, lang)` - Get localized location
- `getProjectDescription(project, lang)` - Get full description
- `getProjectClient(project, lang)` - Get localized client name

**Language Persistence**: User preference stored in `localStorage` key `site_lang`.

### Project Data Structure

```javascript
{
  id: 'one-park-gubei',           // URL-friendly ID (kebab-case)
  name: '古北壹号',                // Chinese name
  location: '上海 · 中国',          // Location
  client: '万科集团',              // Client name
  year: '2023',                   // Project year
  grossFloorArea: '120,000 m²',   // Area
  status: 'finalized',            // finalized | under-construction | proposed
  statusLabel: '已建成',           // Chinese label
  category: 'architecture',       // architecture | interior | landscape | other
  categoryLabel: '建筑',           // Chinese label
  subCategory: 'landscape',       // Optional secondary category
  
  // Image paths (without extensions - supports AVIF/WebP/JPG)
  imagePath: '/images/projects/01-one-park-gubei',  // Thumbnail
  gallery: ['/images/projects/one-park-gubei/01-one-park-gubei', ...],
  landscapeImages: [...],         // Optional landscape gallery
  interiorImages: [...],          // Optional interior gallery
  
  description: '项目描述...'        // Chinese description
}
```

### Progressive Image Loading

The `PictureImage` component implements automatic format fallback:

```jsx
// Usage - provide path without extension
<PictureImage 
  imagePath="/images/projects/one-park-gubei/01-one-park-gubei"
  alt="Project view"
  className="w-full h-auto"
/>
```

**Fallback Chain**: AVIF → WebP → JPG

For direct `<picture>` element usage (like in HomePage):
```jsx
<picture>
  <source srcSet={`${imagePath}.avif`} type="image/avif" />
  <source srcSet={`${imagePath}.webp`} type="image/webp" />
  <img src={`${imagePath}.jpg`} alt="..." />
</picture>
```

## Image Processing Workflow

### Adding New Project Images

1. **Add source images** to `images/projects/[project-folder]/`
2. **Run compression script** to generate variants:
   ```bash
   node scripts/compress-images.js
   ```
   - Requires FFmpeg installed and in PATH
   - Generates AVIF (crf 35), WebP (quality 82), JPG (q 3)
   - Max width: 2500px
   - Renames files to `01.jpg`, `02.jpg`, etc.

3. **Update `src/content/projects.js`** with new project entry
4. **Build and verify**: `npm run build`

### Image Asset Organization

```
images/
├── home/
│   ├── 01-gubei.avif          # Desktop hero images
│   ├── 01-gubei.webp
│   ├── 01-gubei.jpg
│   ├── m-01-gubei.avif        # Mobile hero images
│   ├── m-01-gubei.webp
│   └── m-01-gubei.jpg
│
├── projects/
│   ├── 01-one-park-gubei.jpg  # Project thumbnails (root level)
│   ├── 02-RoyalPavilion.jpg
│   ├── one-park-gubei/        # Project galleries (subfolders)
│   │   ├── 01-one-park-gubei.avif
│   │   ├── 01-one-park-gubei.webp
│   │   └── 01-one-park-gubei.jpg
│   └── ...
│
└── about/
    ├── hero.jpg
    ├── partner1.jpg
    └── partner2.jpg
```

## Code Style Guidelines

### Formatting
- **Indentation**: 2 spaces
- **Line Endings**: LF (Unix-style)
- **Encoding**: UTF-8
- **Quote Style**: Single quotes for JS/JSX, double for HTML

### Naming Conventions
- **Files**: Lowercase with hyphens (e.g., `project-detail-page.jsx`)
- **Components**: PascalCase (e.g., `ProjectDetailPage`)
- **Variables/functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Routes**: kebab-case (e.g., `/about/partners/:id`)

### Import Order
1. React imports
2. Third-party library imports
3. Absolute imports (`@/components/...`)
4. Relative imports (`../content/...`)
5. CSS imports

### Styling Conventions
- Use Tailwind utility classes exclusively
- Dark theme: Background `#181818`, text white/white-60
- Common pattern: `className="text-white/80 hover:text-white transition-colors"`
- Mobile-first responsive design (use `md:`, `lg:` prefixes)

## Testing Strategy

**No automated test suite** is currently implemented.

### Manual Testing Checklist
- [ ] Verify all routes load without errors
- [ ] Test language switching (EN/中文)
- [ ] Test search functionality
- [ ] Verify image loading (check Network tab for 404s)
- [ ] Test mobile menu on small viewports
- [ ] Test project filtering by status and category
- [ ] Run `npm run build` successfully
- [ ] Verify images copied to `dist/images/`

### Key Routes to Verify
- `/` - Home with carousel
- `/projects` - Project grid with filters
- `/projects/:id` - Individual project pages
- `/about` - About page with tabs
- `/contact` - Contact page

## Content Update Workflow

### Adding a New Project

1. Add project images to `images/projects/[project-id]/`
2. Run `node scripts/compress-images.js` to generate variants
3. Add thumbnail image to `images/projects/` root
4. Add project entry to `src/content/projects.js`:
   ```javascript
   {
     id: 'new-project-id',
     name: '项目名称',
     location: '城市 · 国家',
     client: '客户名称',
     year: '2024',
     grossFloorArea: '100,000 m²',
     status: 'finalized', // or 'under-construction', 'proposed'
     statusLabel: '已建成',
     category: 'architecture', // or 'interior', 'landscape', 'other'
     categoryLabel: '建筑',
     imagePath: '/images/projects/xx-new-project',
     gallery: ['/images/projects/new-project/01-new-project', ...],
     description: '项目描述...'
   }
   ```
5. Add English translations to `src/i18n.jsx` in `projectNameMap`, `projectClientMap`, `projectDescriptionMap`
6. Optionally update `src/content/projects-display-config.js` priority map
7. Run `npm run build` and verify

### Updating Existing Content

| Content Type | Location | Notes |
|--------------|----------|-------|
| Project text | `src/content/projects.js` | Edit description field |
| English translations | `src/i18n.jsx` | Update relevant map entries |
| Navigation labels | `src/i18n.jsx` | Update `messages` object |
| Images | `images/` | Replace file, re-run compression |

## Security Considerations

- No user authentication or sensitive data handling
- Static site - no server-side code
- Images are public assets
- No API keys or secrets in client code
- Deployed to Cloudflare Pages with HTTPS by default

## Common Issues and Solutions

### Images not appearing after build
Ensure images are in `images/` directory (not just `src/`). The post-build script copies `images/` to `dist/images/`.

### Language not persisting
Check `localStorage` key `site_lang` in browser DevTools. Default is `'en'`.

### FFmpeg not found
Image compression scripts require FFmpeg installed and available in system PATH.

### Route 404 on refresh
Cloudflare Pages SPA mode handles this via `wrangler.jsonc`. For local dev, Vite handles it.

## Reference Documentation

- `docs/source-asset-map.md` - Maps source materials to runtime paths
- `docs/english-mapping-status.md` - Translation tracking
- `CLAUDE.md` - Additional agent guidance

## Commit and PR Guidelines

### Commit Format
```
type(scope): short summary

Examples:
fix(images): replace missing project hero
feat(content): add new project 'Lot HK231'
refactor(components): simplify Navigation state
```

### PR Requirements
- Describe what changed and why
- Include before/after screenshots for visual changes
- List updated file paths for large asset changes
- Note any follow-up tasks or limitations
- Run `npm run build` before submitting

---

*Last updated: 2026-03-02*
