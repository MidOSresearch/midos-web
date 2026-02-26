# Contributing to MidOS Web

## Projects

This repo contains two independent apps:

### `web/` — Landing & Docs (Astro + Starlight)

```bash
cd web && npm install && npm run dev
```

- Astro 5 + Starlight for docs
- Tailwind CSS v4
- React components for interactive sections

### `app/` — Dashboard (Next.js 15)

```bash
cd app && npm install && cp .env.example .env.local && npm run dev
```

- Next.js 15 App Router, Server Components
- Tailwind CSS v3 (dark-only theme)
- NextAuth v5 (GitHub, Google, Magic Code)
- TypeScript strict

## PR Rules

1. **Branch from `main`**: name `feat/description` or `fix/description`
2. **TypeScript must compile**: zero errors
3. **No secrets**: never commit `.env.local`, API keys, or tokens
4. **No new dependencies** without discussion first
5. **Responsive**: test at 375px, 768px, 1024px minimum
6. **Small PRs**: one feature or fix per PR

## Review Process

All PRs require maintainer review before merge. Do **not** push directly to `main`.

## Theme (Dashboard)

Dark-only. Colors in `app/tailwind.config.js`:

| Token | Hex | Use |
|-------|-----|-----|
| `penguin-bg` | `#0a1628` | Page background |
| `penguin-surface` | `#1a2940` | Card backgrounds |
| `midos-500` | `#009688` | Primary (teal) |

Fonts: **Inter** (UI) + **JetBrains Mono** (code).
