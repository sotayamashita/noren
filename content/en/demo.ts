import type { Scene } from "@/lib/demo/scene";

/**
 * The demo timeline: a coding agent turns a fresh copy of the template into
 * the page for a product, the page appears in the browser, one annotation
 * comes back through Agentation, the agent fixes it, the browser scrolls
 * through the finished guide and the build passes.
 *
 * How to write one for another product
 * - Split the story into 5–8 beats; each beat is one or two steps below.
 * - Times are ms from the start of the loop. Leave 600–1000 ms between beats
 *   and at least 900 ms on a spinner so it reads as "thinking".
 * - The terminal look (Claude Code, Codex) comes from `site.demo.agent`;
 *   the scene only says what happens.
 * - Cursor and scroll steps point at a block `id` from `browser.view`; no
 *   pixel maths.
 * - Under `prefers-reduced-motion` only the final frame is shown, so make sure
 *   the last steps tell the ending on their own.
 * - Run `just check-demo` after editing.
 */
const page = [
  { id: "demo", kind: "demo" },
  { id: "headline", kind: "heading" },
  { id: "subheadline", kind: "text" },
  { id: "install-title", kind: "heading", label: "Install" },
  { id: "install", kind: "code" },
  { id: "steps-title", kind: "heading", label: "Getting started" },
  { id: "steps", kind: "steps" },
  { id: "features-title", kind: "heading", label: "Features" },
  { id: "features", kind: "cards" },
  { id: "faq-title", kind: "heading", label: "FAQ" },
  { id: "faq", kind: "faq" },
  { id: "star", kind: "button", label: "Star on GitHub" },
] as const;

export const demoScene: Scene = {
  duration: 14_500,
  steps: [
    // Beat 1: the agent starts in a fresh copy of the template.
    { at: 0, target: "terminal", type: "focus" },
    { at: 0, directory: "~/my-awesome-product", type: "terminal.boot" },
    {
      at: 600,
      text: "Follow AGENTS.md and make this the page for Acme CLI",
      type: "terminal.prompt",
    },

    // Beat 2: it reads the product and writes the content.
    {
      at: 1300,
      message: "reading acme-cli/README.md…",
      type: "terminal.spinner",
    },
    {
      at: 2100,
      text: "read README.md, docs/usage.md",
      tone: "muted",
      type: "terminal.line",
    },
    { at: 2300, message: "writing content…", type: "terminal.spinner" },
    {
      added: 3,
      at: 3000,
      file: "content/en/site.json",
      removed: 3,
      type: "terminal.diff",
    },
    {
      added: 46,
      at: 3300,
      file: "content/en/demo.ts",
      removed: 41,
      type: "terminal.diff",
    },
    {
      added: 28,
      at: 3600,
      file: "content/en/guide.mdx",
      removed: 22,
      type: "terminal.diff",
    },

    // Beat 3: the page appears in the browser.
    { at: 3900, blocks: [...page], type: "browser.view" },
    { at: 3900, type: "browser.url", url: "localhost:3000" },
    { at: 3900, state: "loading", type: "browser.state" },
    { at: 3900, target: "browser", type: "focus" },
    { at: 4500, state: "ok", type: "browser.state" },

    // Beat 4: one annotation through Agentation.
    {
      at: 4800,
      label: "Shorter headline",
      target: "headline",
      type: "cursor",
    },
    { at: 5400, click: true, target: "headline", type: "cursor" },

    // Beat 5: the agent receives it and fixes the copy.
    { at: 5700, target: "terminal", type: "focus" },
    {
      at: 5700,
      text: "annotation on h1: Shorter headline",
      tone: "muted",
      type: "terminal.line",
    },
    { at: 5900, message: "rewriting…", type: "terminal.spinner" },
    {
      added: 1,
      at: 6700,
      file: "content/en/site.json",
      removed: 1,
      type: "terminal.diff",
    },

    // Beat 6: the annotation is resolved.
    { at: 7000, target: "browser", type: "focus" },
    { at: 7000, target: "headline", tone: "success", type: "cursor" },
    { at: 7700, target: null, type: "cursor" },

    // Beat 7: the browser scrolls through the finished guide.
    { at: 7800, target: "install-title", type: "browser.scroll" },
    { at: 8500, target: "steps-title", type: "browser.scroll" },
    { at: 9200, target: "features-title", type: "browser.scroll" },
    { at: 9900, target: "faq-title", type: "browser.scroll" },

    // Beat 8: the build passes.
    { at: 10_600, target: "terminal", type: "focus" },
    {
      at: 10_600,
      text: "✓ just build (en, ja)",
      tone: "success",
      type: "terminal.line",
    },
    // Beat 9: the browser comes forward with the badge and holds it. This is
    // the frame reduced motion shows.
    { at: 11_200, target: "browser", type: "focus" },
    { at: 11_200, text: "Ready to ship", type: "browser.overlay" },
  ],
};
