import type { Scene } from "@/lib/demo/scene";

/**
 * The demo timeline: an agent tests a signup flow in the browser, sees the
 * request fail, patches the API, and re-runs until it passes.
 *
 * How to write one for another product
 * - Split the story into 5–8 beats; each beat is one or two steps below.
 * - Times are ms from the start of the loop. Leave 600–1000 ms between beats
 *   and at least 900 ms on a spinner so it reads as "thinking".
 * - The terminal look (Claude Code, Codex) comes from `site.demo.agent`;
 *   the scene only says what happens.
 * - Cursor steps point at a block `id` from `browser.view`; no pixel maths.
 * - Under `prefers-reduced-motion` only the final frame is shown, so make sure
 *   the last steps tell the ending on their own.
 * - Run `just check-demo` after editing.
 */
export const demoScene: Scene = {
  duration: 11_000,
  steps: [
    // Beat 1: the agent starts and gets a task.
    { at: 0, target: "terminal", type: "focus" },
    { at: 0, directory: "~/projects/acme", type: "terminal.boot" },
    {
      at: 800,
      text: "/showcase 登録フローをテストして",
      type: "terminal.prompt",
    },
    { at: 1600, message: "git diff を確認中…", type: "terminal.spinner" },
    {
      at: 2400,
      text: "変更ファイル 2 件: signup.tsx, api/signup.ts",
      tone: "muted",
      type: "terminal.line",
    },

    // Beat 2: it opens the page in a real browser.
    {
      at: 2600,
      blocks: [
        { id: "title", kind: "heading" },
        { id: "intro", kind: "text" },
        { id: "email", kind: "input" },
        { id: "password", kind: "input" },
        { id: "signup", kind: "button", label: "登録する" },
      ],
      type: "browser.view",
    },
    { at: 2600, type: "browser.url", url: "localhost:3000/signup" },
    { at: 2600, state: "loading", type: "browser.state" },
    { at: 2600, target: "browser", type: "focus" },
    { at: 3300, state: "ok", type: "browser.state" },

    // Beat 3: it clicks the button and the request fails.
    { at: 3300, label: "登録する", target: "signup", type: "cursor" },
    { at: 4100, click: true, target: "signup", type: "cursor" },
    { at: 4400, state: "error", type: "browser.state" },
    { at: 4400, target: "signup", tone: "error", type: "cursor" },
    {
      at: 4400,
      console: [
        { level: "log", text: "submit signup" },
        {
          level: "error",
          text: "POST /api/signup 500 (Internal Server Error)",
        },
      ],
      panel: "console",
      type: "browser.panel",
    },
    { at: 5000, target: null, type: "cursor" },

    // Beat 4: the agent reports the evidence and patches the code.
    { at: 5100, target: "terminal", type: "focus" },
    {
      at: 5100,
      text: "✗ POST /api/signup → 500 Internal Server Error",
      tone: "error",
      type: "terminal.line",
    },
    { at: 5800, message: "修正中…", type: "terminal.spinner" },
    {
      added: 4,
      at: 6900,
      file: "api/signup.ts",
      removed: 1,
      type: "terminal.diff",
    },

    // Beat 5: it re-runs and everything passes.
    { at: 7600, message: "再実行中…", type: "terminal.spinner" },
    { at: 7600, state: "loading", type: "browser.state" },
    { at: 8300, state: "ok", type: "browser.state" },
    {
      at: 8300,
      network: [
        { method: "GET", path: "/signup", status: "ok" },
        { method: "POST", path: "/api/signup", status: "ok" },
      ],
      panel: "network",
      type: "browser.panel",
    },
    {
      at: 8300,
      label: "登録する",
      target: "signup",
      tone: "success",
      type: "cursor",
    },
    {
      at: 8900,
      text: "✓ 登録フロー成功（検証 2 件）",
      tone: "success",
      type: "terminal.line",
    },
    { at: 10_500, panel: null, type: "browser.panel" },
    { at: 10_500, target: null, type: "cursor" },
  ],
};
