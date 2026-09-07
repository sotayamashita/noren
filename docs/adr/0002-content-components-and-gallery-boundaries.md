---
type: ADR
id: "0002"
title: "Separate content, component, and gallery responsibilities"
status: proposed
date: "2026-09-06T00:00:00+09:00"
superseded_by: null
---

# ADR-0002: Separate Content, Component, and Gallery Responsibilities

## Context

Content edited for each product is split between `content/` and `messages/`. Steps and FAQ are placed in page components, while the MDX prose is called `Overview`. Changing the explanation or its order requires looking in several places.

The public demo and the Slack scenario used for development checks also share `content/demo/`. Someone adapting the template to another product cannot easily tell which scenario to edit.

The public site remains a single page, with the demonstration called `demo` and the explanation called `guide`. Existing shadcn Typeset styles the guide prose, while steps, FAQ, and installation retain their existing appearance and interactions. Keep `app/typeset.css` unchanged.

This structure also requires revisiting the blanket demo exclusion in [ADR-0001](./0001-spacing-and-radius-scale.md). Distinguish shared controls from UI that reproduces another product's appearance.

## Decision

ADR-0004 refines the Hero and gallery placement below. Public content, Typeset, and design-scale boundaries remain in effect.

Keep public content in `content/`, development samples in `gallery/`, and rendering and interaction in `components/`, with `app/` assembling the `demo` and `guide` into one page. Each locale's `guide.mdx` owns the guide content and order, using Typeset for ordinary prose and components built with the existing UI for steps, FAQ, and installation.

## Options Considered

- Option A (chosen): Separate public content, gallery samples, and rendering components; collect guide content in MDX and combine Typeset with the existing UI. Advantages: routine edits have a clear home, and the existing steps, FAQ, and installation UI are preserved. Disadvantages: references and translations must be migrated, and the CSS boundary between prose and controls must be maintained.
- Option B: Keep the current `content/`, `messages/`, and `sections/` structure. Advantages: no migration is needed, and existing custom styling is preserved. Disadvantages: guide content and its display order remain scattered across several locations.
- Option C: Replace steps with ordinary lists and FAQ with `details` and `summary`, styling the entire guide with Typeset. Advantages: fewer dedicated components. Disadvantages: the existing appearance and shadcn Accordion interactions cannot be preserved.

## Consequences

Routine content changes stay within `content/`, and the same rendering components can be checked on the public page and in the gallery. Adding features or locales also requires changes to components, types, and i18n configuration.

The migration may miss imports or translation keys. Typeset styles may conflict with control classes, so verify appearance and interaction within the prose. Record the reason for each reproduction exception to prevent exclusions from spreading to ordinary UI.

Revisit this decision when multiple public pages need different guide structures, Typeset cannot support the required presentation, or the boundary between reproduced UI and shared controls changes.

### Content, components, and page responsibilities

Collect routinely edited, product-specific content in `content/`. Components render it and provide interaction; `app/` assembles the page.

```text
content/          What to communicate and demonstrate
    ↓
components/       How to display it and let users interact
    ↓
app/              Assemble one page
```

This diagram shows responsibilities, not a required import direction. For example, MDX can import rendering components.

### Directory structure

The following structure shows the files relevant to this decision after migration.

```text
noren/
├── content/                       # Public content edited routinely
│   ├── site.ts                    # Product name, URL, repository, demo settings
│   ├── en/
│   │   ├── demo.ts                # English public scenario
│   │   ├── guide.mdx              # Guide, steps, FAQ, component placement
│   │   └── site.json              # Site and control labels
│   └── ja/
│       ├── demo.ts                # Japanese public scenario
│       ├── guide.mdx
│       └── site.json
│
├── gallery/                       # Development scenarios and display samples
│   ├── nav.tsx
│   ├── tile.tsx
│   ├── demo/
│   │   ├── gallery.tsx
│   │   ├── states.tsx
│   │   └── slack.ts
│   └── guide/
│       ├── gallery.tsx
│       └── content.mdx
│
├── components/                    # Components used by public pages and gallery
│   ├── site/
│   │   ├── hero.tsx
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   ├── theme-toggle.tsx
│   │   └── locale-switcher.tsx
│   ├── demo/
│   │   ├── stage.tsx
│   │   ├── use-scene.ts
│   │   ├── terminal.tsx
│   │   ├── agents/
│   │   ├── browser/
│   │   ├── mac/
│   │   └── slack/
│   ├── guide/
│   │   ├── guide.tsx
│   │   ├── steps.tsx              # Steps / Step
│   │   ├── faq.tsx                # Faq / FaqItem
│   │   ├── code-block.tsx
│   │   ├── install-command.tsx
│   │   └── github-stars.tsx
│   ├── copy-button.tsx
│   ├── icons.tsx
│   └── ui/                        # Components installed from shadcn
│
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Place Hero and Guide
│   │   └── dev/                   # Gallery routes and layout
│   ├── globals.css
│   └── typeset.css                # Preserve existing prose typography
├── proxy.ts                       # Next.js request entry point
├── mdx-components.tsx             # Map MDX elements to rendering components
├── lib/
│   ├── demo/scene.ts              # Scene types and state updates
│   └── i18n/                      # Locale routing and translation loading
├── tools/
│   ├── demo/check-scene.ts        # Validate public and gallery scenarios
│   └── oxlint/design-scale/
└── oxlint.config.ts
```

Edit content in `content/`, component behavior in `components/`, and page composition or shared design in `app/`. New rendering features or locales may also require changes to types and i18n configuration.

### Demo and guide

`demo/` handles scene playback, state, and rendering. `Hero` lives in `components/site/` and composes the demonstration with the product heading and tagline. Public scenarios live in `content/{en,ja}/demo.ts`, one per locale. Duplication of text and timelines is allowed; edit each locale independently. The app loads the scene for the locale and passes it to Hero through props. Each file can define either a CLI and browser demonstration or a Slack demonstration.

`guide.mdx` owns the guide content, order, and headings. Steps and FAQ prose live in MDX and are not duplicated in `site.json`. MDX uses `Steps` and `Step` for steps, and `Faq` and `FaqItem` for FAQ. Steps retain the existing custom numbered UI; FAQ uses the installed shadcn Accordion.

```text
Page
├── Hero
│   └── DemoStage
└── Guide [.typeset.typeset-docs]
    └── guide.mdx
        ├── Introduction
        ├── InstallCommand
        ├── Steps / Step
        ├── Code examples
        ├── Faq / FaqItem
        └── GithubStars
```

The order above is an example and can be changed in MDX. Place `InstallCommand` and `GithubStars` from MDX. These components handle switching, copying, and fetching star counts, but do not own page width or outer section margins.

### Installation and translations

Write installation methods, targets, commands, tab names, and selection labels in `content/{locale}/guide.mdx`, and pass them through the `tabs` prop of `InstallCommand`. Use `command` for a single command and `options` for target-specific choices. Duplication across locales is allowed; update each locale's MDX when installation content changes. Do not introduce a shared `content/install.ts`.

`InstallCommand` handles tab selection, target switching, and copying. Site-wide copy and generic labels such as copy actions live in `content/{locale}/site.json`. `content/site.ts` owns locale-independent settings; each locale's `site.json` owns translated labels. Update translation loading and type definitions accordingly. `llms.txt` links to the public guide containing installation, workflow, and FAQ content.

Keep the i18n implementation in `lib/i18n/`. Pass `./lib/i18n/request.ts` to `createNextIntlPlugin` in `next.config.ts`. Keep the Next.js entry point `proxy.ts` at the root, importing `lib/i18n/routing.ts`.

### Typeset and interactive components

`Guide` wraps `guide.mdx` in Typeset to style ordinary headings, paragraphs, lists, and code. `Steps`, `Faq`, and `InstallCommand` receive Typeset flow spacing through an outer `figure`, while their interiors opt out with `not-typeset`. Set their inner font size and line height explicitly rather than relying on inheritance from the prose. Keep `app/typeset.css` unchanged.

React components handle the existing step decoration, FAQ expansion, installation switching, and data fetching. MDX passes content through children and props such as title and question. Code blocks retain Typeset typography, existing syntax highlighting, and copying. Leave ordinary prose typography to Typeset. Adjust embedded control layout, wrapping, and link decoration in `components/guide/`. Vertically center code and its copy button, and allow long code to scroll horizontally. Keep installation target names on one line and omit underlines from the GitHub star button.

When the demo and guide need shared visuals, extract only components that both actually use. Shared components must not depend on playback state or MDX. Do not add a shared window or generic embedding mechanism solely for this ADR.

With the current `app/` location, keep `mdx-components.tsx` at the root and limit it to mapping MDX elements to rendering components. Keep rendering and interaction implementations in `components/guide/`.

### Public content and gallery

Place `gallery/` at the repository root, separate from public content. Move the Slack validation scenario and the MDX sample covering all Typeset elements here. Keep gallery routes and layout in `app/[locale]/dev/`, with the guide at `dev/guide`. Gallery views, navigation, tiles, and display cases live in `gallery/`; route files load content and assemble the page.

Public pages must not depend on `gallery/`. The gallery can render both `gallery/` samples and `content/` public content through the actual components. Do not duplicate rendering components. Preserve the existing requirement that development routes return 404 in production.

### Design-scale enforcement

Apply design-scale to spacing and radii in custom UI. This includes the site shell, Guide container and added controls, shared components, demo playback controls, and ordinary demo layout.

The scope is as follows.

| Target | Scope |
| --- | --- |
| `components/site/` | Apply to the shell and controls |
| `components/site/hero.tsx` and `components/demo/stage.tsx` | Apply to ordinary layout and playback controls |
| Other components in `components/demo/` | Apply by default; allow exceptions only where needed to reproduce macOS, Slack, browser, or CLI appearance |
| `components/guide/` | Apply to the Guide container, step decoration, custom FAQ styling, installation switching, and copy controls |
| Shared components in `components/` | Apply to custom UI |
| `components/ui/` | Preserve the existing exclusion for shadcn-generated components |
| JSX in `app/` | Apply to public page and development gallery layout |
| `gallery/` | Do not exclude based on location; apply the same rules to inspected JSX |
| `guide.mdx` and gallery sample MDX | Leave ordinary prose to Typeset and do not write custom classes; keep internal component styling in components/guide |
| `app/typeset.css` | Exclude from checks and preserve existing typography |

Remove the blanket exclusion for `components/demo/**`. Exempt values needed for reproduction individually, with reasons. Allow file-level exemptions only when the entire file is dedicated to reproduction; verify the targets and reasons during implementation. Implement and check additional MDX controls in `components/guide/`.

Exempt spacing only; check radius even in reproduction-only files. Standardize ADR references in `oxlint.config.ts` as JSDoc comments containing the ADR number and reason for the setting, followed by `@see` with a repository-relative path.

The checker inspects spacing and radius class strings in JSX `className`, `cn()`, and similar calls. CSS, inline `style`, and scene coordinates are outside its scope. The radius rule checks arbitrary values; it does not guarantee validation of parent-child radius relationships or every permitted token name.

Do not add analysis of Typeset CSS, scene coordinates, or parent-child radius relationships. Do not alter prose typography. This decision updates the blanket demo exclusion in [ADR-0001](./0001-spacing-and-radius-scale.md); the 4px scale remains unchanged.

### Migration and verification

When adapting the template to a product, edit public content in `content/`. Guide order can also be changed entirely in MDX. Move steps, FAQ, and installation content into MDX while preserving their existing appearance and interactions in components.

Remove `sections/` and rename `Overview` to `Guide`. Do not keep compatibility files at old paths. Delete the unused Section component and prose translation keys, and change Steps and Faq to accept MDX content. Update development gallery and scene checker references, along with the structure described in AGENTS.md. Check all actual importers when moving existing files.

After implementation, run `just typecheck`, `just check`, `just build`, and `just check-demo`. In the gallery, check English and Japanese guides, light and dark themes, narrow widths, installation switching and copying, FAQ keyboard operation, demo playback, and reduced motion. Also verify that public pages do not reference development data and that development routes return 404 in production.

The implementation has migrated to the structure above. The gallery prose file is named `gallery/guide/content.mdx`. `llms.txt` outputs site settings, English metadata, and a guide link without duplicating installation commands. It no longer depends on the moved steps and FAQ translation keys.

Keep scene validation in `tools/demo/check-scene.ts`. `just check-demo` validates the English and Japanese public scenarios and the gallery's Slack scenario. Do not maintain a separate `scripts/` directory.

## References

- Next.js, "Project structure and organization" (year unknown)\
  URL: <https://nextjs.org/docs/app/getting-started/project-structure>\
  Used for: separating file placement from routing and allowing different directory structures.\
  Accessed: 2026-09-06.
- React, "Thinking in React" (year unknown)\
  URL: <https://react.dev/learn/thinking-in-react>\
  Used for: dividing rendering components by responsibility.\
  Accessed: 2026-09-06.
- React, "Passing Props to a Component" (year unknown)\
  URL: <https://react.dev/learn/passing-props-to-a-component>\
  Used for: composing content and rendering components through props and children.\
  Accessed: 2026-09-06.
- Next.js, "Server and Client Components" (year unknown)\
  URL: <https://nextjs.org/docs/app/getting-started/server-and-client-components>\
  Used for: placing client boundaries around interactive parts without making the entire guide a Client Component.\
  Accessed: 2026-09-06.
- next-intl, "Next.js plugin (createNextIntlPlugin)" (year unknown)\
  URL: <https://next-intl.dev/docs/usage/plugin#requestconfig>\
  Used for: specifying the request configuration path so i18n can live under lib.\
  Accessed: 2026-09-06.
- Next.js, "mdx-components.js" (year unknown)\
  URL: <https://nextjs.org/docs/app/api-reference/file-conventions/mdx-components>\
  Used for: keeping mdx-components.tsx at the same level as app.\
  Accessed: 2026-09-06.
- JSDoc, "@see" (year unknown)\
  URL: <https://jsdoc.app/tags-see>\
  Used for: the format for referencing ADRs from configuration comments.\
  Accessed: 2026-09-06.
