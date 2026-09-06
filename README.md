# Showcase

A template for product showcase websites: one landing page with a looping motion demo, an install command, getting-started steps, a GitHub star button, an MDX overview and a FAQ. Ships with English and Japanese, and a light / dark / system theme.

Modeled on the single-page launch sites of developer tools, but with the copy, the demo timeline and the settings pulled out into files you edit instead of JSX.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS v4 · shadcn (nova preset, base-ui) · shadcn Typeset · motion · next-intl · next-themes · MDX with rehype-pretty-code. Tooling: mise, pnpm, just, hk, Ultracite (oxlint + oxfmt).

## Getting started

```bash
mise install
just setup
just dev
```

Open http://localhost:3000 (English) or http://localhost:3000/ja (Japanese).

| Command | What it does |
| --- | --- |
| `just dev` | Dev server |
| `just build` | Production build (the real check for routing and i18n) |
| `just typecheck` | `tsc --noEmit` |
| `just check` / `just fix` | Lint and format with Ultracite |
| `just demo-check` | Validate the demo timeline |
| `just install-hooks` | Install the hk pre-commit hook (oxfmt, oxlint, typecheck) |

## Make it yours

1. **`content/site.ts`**: product name, URL, GitHub repo, install tabs (one command, or a dropdown of per-agent commands), the demo's terminal skin.
2. **`messages/en.json`, `messages/ja.json`**: every string on the page. Keep the keys identical across locales; `global.d.ts` types them.
3. **`content/demo/scene.ts`**: the demo. A scene is a list of timestamped steps (`terminal.boot`, `terminal.prompt`, `terminal.spinner`, `terminal.line`, `terminal.diff`, `browser.view`, `browser.url`, `browser.state`, `browser.panel`, `cursor`, `focus`). The cursor targets block ids, not coordinates. Pick the terminal look with `demo.agent` in `content/site.ts` (`claude-code` or `codex`); add a CLI under `components/demo/agents`. `just demo-check` validates the file.
4. **`content/en/overview.mdx`, `content/ja/overview.mdx`**: long-form prose, styled by Typeset (`app/typeset.css`).
5. **`app/globals.css`**: shadcn colour tokens for both themes. Components only use tokens, so the demo works in dark mode too.

Adding a locale: extend `i18n/routing.ts`, add `messages/<locale>.json`, `content/<locale>/overview.mdx`, and a label in `content/site.ts`.

## What you get for free

- Static `/` and `/ja` with `hreflang` alternates, canonical URLs and a sitemap.
- A generated Open Graph image per locale (`app/[locale]/opengraph-image.tsx`).
- `/llms.txt` built from the same copy as the page.
- `prefers-reduced-motion` support: the demo shows its final frame instead of animating.

## Layout

```
app/[locale]/        layout, page, not-found, opengraph-image
components/sections/ hero, install-command, steps, github-stars, overview, faq
components/demo/     stage, use-scene, terminal, mac/, agents/{claude-code,codex}, browser/
content/             site.ts, demo/scene.ts, {en,ja}/overview.mdx
messages/            en.json, ja.json
i18n/                routing, request, navigation
lib/demo/scene.ts    scene types and reducer
```

See `AGENTS.md` for conventions when working with a coding agent.
