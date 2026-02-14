# CLAUDE.md

This file provides guidance for agents working in this repository.

## Project Overview

RA Architects website is a modern React SPA showcasing architectural projects with progressive image loading and bilingual content (Chinese/English).

**Tech Stack:**
- React 18.3.1 with React Router DOM 6.26.2
- Vite 5.2.0 for fast development and optimized builds
- Tailwind CSS (via CDN) for styling
- Progressive image loading (AVIF → WebP → JPG fallback)

## Architecture

### Directory Structure
```
src/
├── components/
│   └── PictureImage.jsx    # Progressive image component with format fallback
├── pages/
│   ├── HomePage.jsx         # Hero carousel with desktop/mobile variants
│   ├── ProjectsPage.jsx     # Featured projects grid
│   ├── AllProjectsPage.jsx  # Complete project listing
│   ├── ProjectDetailPage.jsx # Individual project gallery
│   ├── UnderConstructionPage.jsx
│   ├── ProposedProjectsPage.jsx
│   ├── AboutPage.jsx        # About, partners, awards (query param tabs)
│   └── ContactPage.jsx
├── content/
│   └── projects.js          # Project data array (11 projects)
└── App.jsx                 # Route definitions with BrowserRouter
```

### Key Patterns

**Progressive Image Loading:**
- Uses `<picture>` element with AVIF → WebP → JPG fallback
- `PictureImage` component auto-strips extensions and adds format sources
- Applied globally: home carousel, project galleries, throughout site

**Project Data Structure:**
```javascript
{
  id: 'one-park-gubei',
  name: '古北壹号',
  status: 'finalized',           // finalized|under-construction|proposed
  category: 'architecture',       // architecture|interior|other
  imagePath: '/images/projects/01-one-park-gubei',
  gallery: ['/images/projects/one-park-gubei/01-...', ...],
  description: '...'
}
```

**Routing:**
- Home: `/`
- Projects: `/projects`, `/all-projects`, `/projects/:id`
- Filtered: `/under-construction`, `/proposed`, `/projects?filter=architecture`
- About: `/about?tab=partners` (default: about us)
- Contact: `/contact`

## Commands

### Development
```bash
npm run dev              # Start dev server (port 3000, auto-opens)
npm run build            # Production build to dist/
npm run preview          # Preview production build
npm run check            # Syntax check JS/JSX files
```

### Image Processing
```bash
# Generate AVIF/WebP/JPG variants (requires FFmpeg)
node scripts/compress-images.js

# Process projects root directory
node scripts/compress-projects-root.js
```

**Image Processing Details:**
- Max width: 2500px
- Generates: AVIF (crf 35), WebP (quality 82), JPG (q 3)
- Renames to 01.jpg, 02.jpg, etc. per project folder
- Requires FFmpeg installed and available in PATH

## Content Update Workflow

### Adding/Updating Projects
1. Add images to `images/projects/[project-name]/`
2. Run image compression script to generate variants
3. Add entry to `src/content/projects.js`:
   - Set `id` (kebab-case), `name`, `status`, `category`
   - Point `imagePath` to project folder
   - Add gallery images (without extensions)
4. Build and verify: `npm run build`

### Updating Existing Content
- **Text:** Edit `src/content/projects.js` descriptions
- **Images:** Replace in `images/`, re-run compression script
- **Navigation:** Modify `src/components/Navigation.jsx`
- **Styling:** Tailwind classes in components (no build step for CSS)

### Source Material Mapping
Reference docs in `docs/` map source files to runtime locations:
- `docs/source-asset-map.md` - Source folder → runtime paths
- `docs/english-mapping-status.md` - English translation status

## Important Notes

- **Dark theme:** Site uses `#0a0a0a` background (Tailwind `bg-[#0a0a0a]`)
- **Path alias:** `@` maps to `/src` (configured in vite.config.js)
- **Code splitting:** React and React Router in separate chunks
- **Never edit `dist/` directly** - always rebuild from source
- **Reference material:** `20260212-网站资料整理/` is source-only, not used at runtime
