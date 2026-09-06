<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Showcase template

A product showcase website template: one landing page with a looping motion demo, an install command, steps, a GitHub star button, an MDX overview and a FAQ. It ships with language switching (en, ja) and a light / dark / system theme.

`CLAUDE.md` points here. Instructions in this file apply to every agent working in the repo.

## Working agreement

- The user's instructions take precedence over anything in this file or in a skill. If they conflict, follow the user and say which instruction you set aside.
- Infer intent from the request and the conversation, then carry the task to completion. Do routine, reversible work without asking: read files, run checks, edit code, create branches. Ask a question only when the answer would change the result, and ask it after the work that does not depend on it is done.
- When you pause or change direction because of an instruction file or skill, name the file, quote the line, and explain how it applies.
- If something you find contradicts the task as described, say so in one or two sentences and continue under a stated assumption.
- Write replies as short paragraphs in plain language. Lead with the outcome. Use a list only for parallel items. Do not use stock phrases, contrastive framing ("X, not Y"), or invented compound labels.
- Verify in proportion to the change. `just typecheck` and `just check` for any code change; `just build` when routing, config, MDX, or i18n files change. Do not add tests that mirror the implementation.

## Commands (just, never package.json scripts)

Tool versions come from `mise.toml` (node 24, pnpm, hk, just). Run `mise install` once.

| Command | Purpose |
| --- | --- |
| `just setup` | `pnpm install` and install git hooks |
| `just dev` | Dev server on http://localhost:3000 (`/ja` for Japanese) |
| `just build` | Production build; the definitive check for routing and i18n |
| `just typecheck` | `tsc --noEmit` |
| `just check` / `just fix` | Ultracite (oxlint + oxfmt) check / auto-fix |
| `just ui button` | Add a shadcn component |
| `just demo-check` | Validate `content/demo/scene.ts` |

Git hooks are managed by hk (`hk.pkl`): the pre-commit hook runs oxfmt, oxlint and typecheck on changed files. Install packages through `sfw pnpm add ...`; a local hook blocks bare package-manager network calls.

## Stack

- Next.js 16 App Router, React 19, TypeScript. `proxy.ts` replaces `middleware.ts`; `params` are Promises.
- Tailwind CSS v4 (CSS-first, no tailwind.config) and shadcn (preset `nova`, base-ui primitives). Components in `components/ui` are generated; use the `render` prop instead of `asChild`.
- `motion` (`motion/react`) for animation. `next-intl` for i18n. `next-themes` for the theme. `@next/mdx` with `rehype-pretty-code` for prose.
- shadcn Typeset (`app/typeset.css`) styles rendered markdown. Wrap MDX output in `typeset typeset-docs`.

## Layout

```
app/[locale]/           layout (html, fonts, providers, metadata), page, not-found, opengraph-image
app/sitemap.ts, robots.ts, llms.txt/route.ts
components/sections/    hero, install-command, steps, github-stars, overview, faq
components/demo/        stage.tsx (720x400 canvas, scale, pause, picks the skin), use-scene.ts (player), terminal.tsx
components/demo/mac/    window.tsx (window chrome), cursor.tsx (moves to a `data-anchor` block)
components/demo/agents/ types.ts (AgentSkin), skins.ts (registry), claude-code/, codex/
components/demo/browser/ window.tsx, view.tsx (blocks from `browser.view`), network-panel.tsx, console-panel.tsx
components/demo/slack/  window.tsx (rail, channel, thread pane), message.tsx, thread.tsx, composer.tsx
app/[locale]/dev/demo   dev-only gallery: live demos and every demo component state, light and dark (404 in production)
app/[locale]/dev/ui     dev-only gallery: every MDX element under Typeset (content/dev/kitchen-sink.mdx) and each landing section
components/             site-header, site-footer, theme-toggle, locale-switcher, section, copy-button, code-block (MDX <pre>)
content/site.ts         locale-independent settings: name, url, repo, install commands, demo.agent
content/demo/scene.ts   the demo timeline (see "Writing a demo scene")
content/{en,ja}/*.mdx   long-form prose per locale
messages/{en,ja}.json   every UI string; typed through global.d.ts
i18n/                   routing (locales, as-needed prefix), request config, navigation helpers
lib/demo/scene.ts       scene DSL types, reducer (applyStep) and stateAt()
scripts/check-scene.ts  `just demo-check`: order, duration, cursor targets, panel entries
```

## Customising for a new product

1. `content/site.ts`: name, url, repo, install tabs (a tab has one `command`, or `options` with a per-option command shown behind a dropdown), `demo.agent`.
2. `messages/en.json` and `messages/ja.json`: all copy. Keep both files' keys identical.
3. `content/demo/scene.ts`: the timeline, and `demo.agent` in `content/site.ts` for the terminal look. See "Writing a demo scene".
4. `content/{en,ja}/overview.mdx`: the prose section.
5. Colors live in `app/globals.css` as shadcn tokens; `--success` was added for the demo.

## Writing a demo scene

The demo is data: `content/demo/scene.ts` lists timestamped steps; `lib/demo/scene.ts` defines them and reduces them into state; `components/demo` only draws state. No component edits are needed for a new product.

1. Write the story as 5–8 beats (start, task, open the page, act, fail, fix, pass).
2. Map each beat to steps: `terminal.boot` (start-up screen, gives `directory`), `terminal.prompt`, `terminal.spinner`, `terminal.line` (with `tone`), `terminal.diff`; `browser.view` (blocks with ids), `browser.url`, `browser.state`, `browser.panel` (`console` or `network` with entries, `null` to close); `cursor` (`target` = a block id, `click`, `label`, `tone` = `error` shakes / `success` shows a check; `null` hides); `focus`. For a Slack story set `layout: "slack"` and use `slack.channel`, `slack.compose`, `slack.post` (reply link anchored as `<id>-replies`), `slack.reply` (attachments and actions are anchors), `slack.thread`; see `content/demo/slack-scene.ts`.
3. Timing: ms from loop start, sorted. 600–1000 ms between beats, at least 900 ms on a spinner, 10–12 s total. `duration` is the loop length.
4. The cursor never takes coordinates. It measures the block whose id it targets, so any `browser.view` layout works.
5. Under `prefers-reduced-motion` only the final frame renders: the last steps must show the ending on their own.
6. Run `just demo-check`, then `just dev` and watch one full loop with both `site.demo.agent` values you care about.

## Adding an agent skin

A skin is how one CLI draws the transcript; the scene never changes. Copy `components/demo/agents/codex/` to a new folder, implement `AgentSkin` from `agents/types.ts` (`title`, `Banner`, `Prompt`, `Spinner`, `Diff`, optional `Footer` for CLIs with a persistent input box), register it in `agents/skins.ts`, and select it with `demo.agent` in `content/site.ts`. Use tokens only (`text-primary`, `text-muted-foreground`, `text-success`, `text-destructive`) so both themes work.

## Conventions

- No hardcoded colors in components. Use tokens (`bg-card`, `text-muted-foreground`, `text-success`, `text-destructive`) so both themes work, including inside the demo.
- No copy in JSX. Every visible string comes from `messages/*.json` via `useTranslations` / `getTranslations`. Lists of objects are read with `t.raw`.
- Add a locale by extending `i18n/routing.ts`, `content/site.ts` (`localeLabels`), and adding `messages/<locale>.json` plus `content/<locale>/overview.mdx`.
- Server components by default. Add `"use client"` only for hooks, event handlers, or `motion` components.
- Respect `prefers-reduced-motion`: the demo renders its final frame statically when it is set.
- Links to the same site go through `Link` from `i18n/navigation`, which keeps the locale prefix.

## Code standards (enforced by Ultracite)

Run `just fix` before committing; most issues are auto-fixed. Beyond the linter:

- Explicit types on exported functions. Prefer `unknown` to `any`, `as const` for literal config, narrowing over assertions. Name magic numbers.
- Arrow functions for callbacks, `for...of` over `.forEach`, optional chaining and `??`, template literals, `const` by default.
- Await every promise; use try/catch where failure is expected (network, clipboard) and degrade quietly.
- Function components only. Hooks at the top level with complete dependency arrays. Stable keys, never array indices for dynamic lists. No components defined inside components. `ref` is a prop (no `forwardRef`).
- Semantic HTML and ARIA: real `<button type="button">`, labels on icon-only controls, `rel="noopener noreferrer"` with `target="_blank"`, `aria-hidden` on decorative elements.
- No `console.log`, `debugger`, `dangerouslySetInnerHTML`, `eval`, barrel files, or namespace imports.
- `next/image` for raster images; App Router metadata API for head tags; async data fetching in server components.

# hk

- Before changing files, inspect the project with `hk mcp` or `hk run check --safe --format json`.
- Scope checks to the files you changed. For exact filenames, write a NUL-delimited list and use `--files0-from`; use `--cd` instead of changing hk's process-wide directory.
- Inspect each planned command's effect. Prefer `--safe`; never run an unknown or destructive command without explicit user approval.
- Consume normalized diagnostics from JSON/JSONL, preserve raw tool output for debugging, and review the resulting diff after fixes.
- Use `hk run check --safe --format jsonl` for streaming lifecycle events. A final summary is emitted even when a step fails.
