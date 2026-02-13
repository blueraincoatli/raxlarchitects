# Repository Guidelines

## Project Structure & Module Organization
This repository is a prebuilt static site snapshot.

- `index.html`: App entrypoint that loads bundled CSS/JS from `assets/`.
- `assets/`: Compiled frontend bundles (`index-*.js`, `vendor-*.js`, `i18n-*.js`, `index-*.css`).
- `images/`: Runtime image assets used by pages (`home/`, `projects/`, `about/`, `original/`).
- `20260212-网站资料整理/`: Source reference materials (documents, screenshots, raw exports), not runtime code.

When updating content, prefer replacing files under `images/` and minimal `index.html` changes. Avoid manual edits to minified bundles unless no source project is available.

## Build, Test, and Development Commands
No build scripts are included in this snapshot. Use a static server for local verification:

- `python -m http.server 8080` (from repo root): serve site at `http://localhost:8080`.
- `npx serve .` (optional): alternative static server.

After starting a server, verify key routes in browser refresh/fallback mode:
- `/`
- `/projects`
- `/about`
- `/contact`

## Coding Style & Naming Conventions
- Use 2-space indentation in HTML/CSS when editing non-minified files.
- Keep filenames lowercase with hyphens when adding assets (example: `images/projects/new-project.jpg`).
- Preserve existing bundle naming format (`name-<hash>.js/.css`) if regenerating artifacts from source tooling.
- Use UTF-8 encoding; keep path references web-safe and relative to repo root.

## Testing Guidelines
There is no automated test suite in this repository snapshot.

- Perform manual smoke checks on desktop and mobile viewport widths.
- Confirm no broken asset links in browser devtools network panel.
- Validate that language/content changes render correctly in navigation and project pages.

## Commit & Pull Request Guidelines
Git history is not available in this folder (`.git` missing), so follow a consistent standard:

- Commit format: `type(scope): short summary` (example: `fix(images): replace missing project hero`).
- Keep commits focused (content, assets, or structure; avoid mixing all three).
- PRs should include:
  - What changed and why
  - Before/after screenshots for visual changes
  - List of updated file paths (for large asset replacements)
  - Any follow-up tasks or known limitations
