# MidOS Web

Landing page, documentation, and dashboard for [MidOS](https://github.com/MidOSresearch/midos) — the curated knowledge library for AI agents.

## Structure

```
web/     Astro + Starlight — Landing page & docs (midos.dev)
app/     Next.js 15 — Dashboard & auth (app.midos.dev)
```

## Quick Start

### Landing & Docs (`web/`)

```bash
cd web
npm install
npm run dev     # http://localhost:4321
```

### Dashboard (`app/`)

```bash
cd app
npm install
cp .env.example .env.local   # fill in your values
npm run dev                   # http://localhost:3000
```

## Deployment

Both apps deploy via Coolify from this repo:

| App | Subdomain | Base Directory | Port |
|-----|-----------|---------------|------|
| Landing & Docs | `midos.dev` | `/web` | 80 |
| Dashboard | `app.midos.dev` | `/app` | 3000 |

## Related Repos

- **[midos](https://github.com/MidOSresearch/midos)** — MCP server distribution (Smithery, Glama, PyPI)
- **[midos-core](https://github.com/MidOSresearch/midos-core)** *(private)* — Monorepo, knowledge pipeline, tools

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT
