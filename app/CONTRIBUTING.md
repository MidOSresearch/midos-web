# Contributing to MidOS Frontend

## Stack

- **Next.js 15** (App Router, Server Components)
- **Tailwind CSS v3** (dark-only theme)
- **NextAuth v5** (auth.js — GitHub, Google, Magic Code)
- **TypeScript** (strict)

## Setup

```bash
npm install
cp .env.example .env.local   # fill in your values
npm run dev                   # http://localhost:3000
```

The backend (port 8420) is optional for UI work — the dashboard falls back to session data.

## Theme

Dark-only. Colors defined in `tailwind.config.js`:

| Token | Hex | Use |
|-------|-----|-----|
| `penguin-bg` | `#0a1628` | Page background |
| `penguin-surface` | `#1a2940` | Card backgrounds |
| `penguin-border` | `#263238` | Borders |
| `midos-500` | `#009688` | Primary (teal) |
| `midos-300`–`900` | Teal scale | Accents, badges |

Fonts: **Inter** (UI) + **JetBrains Mono** (code).

## PR Rules

1. **Branch from `main`**, name: `feat/description` or `fix/description`
2. **TypeScript must compile**: `npx tsc --noEmit` with zero errors
3. **No secrets**: never commit `.env.local`, API keys, or tokens
4. **No new dependencies** without discussion first
5. **Dark-only**: all UI must look correct on `#0a1628` background
6. **Responsive**: test at 375px, 768px, 1024px minimum
7. **Small PRs**: one feature or fix per PR — easier to review

## Review Process

All PRs require maintainer review before merge. We may:
- Request changes
- Suggest improvements
- Merge as-is

Do **not** push directly to `main`.

## Project Structure

```
app/
  (auth)/          Login, signup, verify pages
  (protected)/     Dashboard (requires auth)
  api/             Route handlers (checkout, billing, profile)
components/        Reusable UI components
lib/               Types, constants, utilities
auth.ts            NextAuth configuration
tailwind.config.js Theme + color tokens
```
