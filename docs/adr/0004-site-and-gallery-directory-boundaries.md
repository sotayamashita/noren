---
type: ADR
id: "0004"
title: "Clarify site and gallery directory boundaries"
status: accepted
date: "2026-09-06T00:00:00+09:00"
superseded_by: null
---

# ADR-0004: Clarify Site and Gallery Directory Boundaries

## Context

This repository is a single-page product showcase template with localized content, a looping demonstration, and an MDX guide. ADR-0002 separates public content, rendering components, and development samples. That separation remains useful, but two ownership boundaries need refinement.

`components/demo/hero.tsx` combines the demo with the product heading, tagline, and page spacing. These are site composition concerns. Development gallery code is also split between `app/[locale]/dev/`, which contains navigation, tiles, and demo display cases, and `gallery/`, which contains sample content. The `dev/ui` route displays Typeset and guide content, so its name can be confused with the shadcn components in `components/ui/`.

The reference repository at `../ui` separates site components, published content, and authored examples within `apps/v4`. Its monorepo and registry pipeline also support package distribution and generated component variants. This template has no equivalent distribution requirement.

This proposal refines the Hero placement, gallery ownership, and development route name specified in ADR-0002. It retains that ADR's public content boundary, Typeset styling, and design-scale rules, together with ADR-0003's development-only Agentation integration. The refactor does not require backward compatibility for internal imports or development URLs.

## Decision

Keep a single application and organize files by their existing responsibilities: public content in `content/`, rendering and interaction in `components/`, development gallery implementation and samples in `gallery/`, and routing and page assembly in `app/`. Move Hero into `components/site/`, consolidate gallery-specific UI under `gallery/`, and rename the guide preview route to `dev/guide`, updating consumers directly without compatibility exports or redirects.

## Options Considered

- Option A (chosen): Refine the existing directory boundaries. Product customization keeps a clear home, gallery changes stay together, and public and development pages reuse the same rendering components. Imports, development links, lint configuration, and directory documentation need updating.
- Option B: Keep the current layout. This avoids migration work, but leaves gallery implementation and samples scattered and keeps site-level Hero composition inside demo rendering.
- Option C: Move to `apps/` and `packages/`, following the reference repository's top-level layout. This would support independently distributed packages or multiple applications, but introduces package boundaries and build coordination without a current consumer that needs them.

## Consequences

Product authors continue to edit `content/`, component authors edit `components/`, and developers adding display cases work in `gallery/`. The directory name `gallery` now covers both samples and the UI used to inspect them. Developers must preserve its development-only dependency boundary when adding imports.

Existing internal imports and bookmarks to `dev/ui` will break unless updated. Moving gallery code may also leave stale lint targets or accidentally change client boundaries. Update all consumers in the same implementation and verify the production development-route gate. No public URL change is intended.

Revisit this structure when another application needs the same demo engine, components need independent distribution, or the gallery becomes a public product feature.

### Target structure

The tree shows the main responsibility boundaries and affected files. Existing routes and component subdirectories omitted here remain in place.

```text
noren/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── dev/
│   │       ├── layout.tsx
│   │       ├── demo/page.tsx
│   │       └── guide/page.tsx
│   ├── globals.css
│   └── typeset.css
├── content/
│   ├── site.ts
│   ├── en/                     # site.json, demo.ts, guide.mdx
│   └── ja/                     # site.json, demo.ts, guide.mdx
├── components/
│   ├── site/hero.tsx
│   ├── demo/                   # Stage, playback hook, reproduced applications
│   ├── guide/                  # MDX rendering and interactive controls
│   ├── ui/                     # Components installed through shadcn
│   ├── dev/agentation.tsx
│   ├── copy-button.tsx
│   └── icons.tsx
├── gallery/
│   ├── nav.tsx
│   ├── tile.tsx
│   ├── demo/
│   │   ├── gallery.tsx
│   │   ├── states.tsx          # Client-side interactive display cases
│   │   └── slack.ts
│   └── guide/
│       ├── gallery.tsx
│       └── content.mdx
├── lib/
│   ├── demo/scene.ts
│   ├── i18n/
│   ├── og-font.ts
│   └── utils.ts
├── tools/
│   ├── demo/check-scene.ts
│   └── oxlint/design-scale/
├── docs/
│   ├── adr/
│   └── _templates/
├── public/
├── proxy.ts
└── mdx-components.tsx
```

### Ownership and dependencies

`app/` handles route parameters, locale validation, content loading, metadata, and page assembly. Development routes pass loaded content into gallery views. `app/[locale]/dev/layout.tsx` retains the production 404 gate and composes the gallery navigation.

`components/site/hero.tsx` composes the product heading, tagline, and `DemoStage`. `components/demo/` owns demo rendering and playback. Keep the React playback hook beside its consumers and the React-independent scene types and state calculations in `lib/demo/scene.ts`, where the scene checker can also use them.

`gallery/` owns display cases, sample data, navigation, and tiles. It renders the actual public components and may use public content. Public pages and public rendering components must not import from `gallery/`. Keep server-side loading and client-side interactive cases separated when extracting the views.

Agentation remains in `components/dev/` because it annotates public pages during development. Preserve the development gate and locale-layout integration documented in ADR-0003.

Keep public copy, demo dialogue, and guide composition in the existing locale files. Preserve `app/typeset.css`, the root MDX mapping, and `lib/i18n/`. Do not add a registry pipeline, workspace packages, a `features/` layer, or a top-level hooks directory as part of this refactor.

### Implementation and verification

1. Move Hero to `components/site/hero.tsx`. Move development navigation, tiles, and demo gallery implementation into `gallery/`; extract the guide gallery presentation there as well. Rename the development guide route from `dev/ui` to `dev/guide`.
2. Update imports, development navigation, any affected lint targets, and AGENTS.md. Reconcile ADR-0002's affected placement guidance when this proposal is adopted. Delete obsolete files without leaving re-export shims or development-route redirects.
3. Run `just typecheck`, `just check`, `just build`, and `just check-demo`. Inspect public and gallery pages in both locales and themes, verify demo playback and reduced motion, and check guide controls. Confirm that development routes return 404 in production and public rendering has no gallery dependencies.

The directory refactor is implemented. `gallery/demo/gallery.tsx` remains a server component and composes the client-side display cases in `gallery/demo/states.tsx`.

## References

- Local reference repository, [v4 application](../../../ui/apps/v4), [authored examples](../../../ui/apps/v4/examples/README.md), and [registry responsibilities](../../../ui/apps/v4/registry/README.md). Used for: comparing site components, public content, examples, and distribution-specific infrastructure. Inspected: 2026-09-06. These links require the sibling `ui` checkout.
- [ADR-0002: Separate Content, Component, and Gallery Responsibilities](./0002-content-components-and-gallery-boundaries.md). Used for: the existing content boundaries, Typeset ownership, and gallery isolation that this proposal retains and refines.
- [ADR-0003: Agentation for Visual Feedback to Coding Agents](./0003-agentation-visual-feedback.md). Used for: retaining the development-only annotation component in the locale layout.
