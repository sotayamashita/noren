---
type: ADR
id: "0003"
title: "Agentation for visual feedback to coding agents"
status: accepted
date: "2026-09-06T00:00:00+09:00"
superseded_by: null
---

# ADR-0003: Agentation for Visual Feedback to Coding Agents

## Context

Most changes to this template are visual: the demo's window chrome, the Slack reproduction, Typeset prose, and both themes. Describing an element in words ("the second row in the network panel") is slow and ambiguous for a coding agent. Agentation is a development toolbar that turns a click on an element into structured output (selector, CSS classes, component chain, computed styles) and, through `agentation-mcp`, delivers it to the agent over MCP.

Two constraints shape the setup. ADR-0002 keeps development-only material out of public pages, yet the elements worth annotating live on the public landing page. Work in this repository is done with both Claude Code and Codex, and MCP registration must not leak into user-level configuration.

## Decision

Mount `components/dev/agentation.tsx` at the end of the locale layout behind a static `NODE_ENV === "development"` check, and register `agentation-mcp` for this project only, in `.mcp.json` for Claude Code and `.codex/config.toml` for Codex, both running `pnpm exec agentation-mcp server`.

## Options Considered

- Option A (chosen): Locale layout with a static development gate. Every page, including the hero and the guide, can be annotated. The check is evaluated at build time, so production output contains neither the component nor the package. The public layout gains one development-only import, which this ADR documents as the deliberate exception to ADR-0002.
- Option B: Mount only under `app/[locale]/dev`. Keeps the public layout untouched but excludes the pages users actually ship, which is where most visual feedback belongs.
- Option C: Register the MCP server in `~/.claude.json` and `~/.codex/config.toml`. Works for one machine but leaves the repository without a reproducible setup and hides the dependency on port 4747.
- Option D: Run one HTTP server through a `just` recipe and give each agent `--mcp-only`. Deterministic, but adds a manual step that fails silently when forgotten. The default mode already degrades well: a second server finds port 4747 busy, skips HTTP and talks to the first one.

## Consequences

Both agents share one configuration and one annotation store (in memory; the toolbar keeps its own copy in localStorage and re-syncs on load). The toolbar is desktop-only and depends on React's development-mode source information, so it offers nothing in production or on mobile. The `agentation` and `agentation-mcp` packages are licensed under PolyForm Shield 1.0.0, which permits use in this template but not building a competing product. Revisit this decision if the toolbar starts affecting demo timing in development, if either agent changes how project-scoped MCP configuration is read, or if the license changes.

## References

- Benji Taylor, "Agentation" (2026) URL: <https://www.agentation.com/> Used for: product scope, output format, desktop-only and development-only limits. Accessed: 2026-09-06.
- Benji Taylor, "benjitaylor/agentation" (2026) URL: <https://github.com/benjitaylor/agentation> Used for: `endpoint` prop, `agentation-mcp` CLI flags (`--mcp-only`, `--http-url`, default port 4747), EADDRINUSE behaviour, SQLite fallback. Accessed: 2026-09-06.
- OpenAI, "Model Context Protocol" (2026) URL: <https://learn.chatgpt.com/docs/extend/mcp> Used for: project-scoped `.codex/config.toml` for trusted projects and the `[mcp_servers.<name>]` table format. Accessed: 2026-09-06.
